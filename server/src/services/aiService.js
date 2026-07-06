const { getGeminiModel } = require('../config/gemini');

// ── Prompt Builder ─────────────────────────────────────────────────────────────
const buildAnalysisPrompt = (resumeText, jobDescription) => `
You are a world-class ATS (Applicant Tracking System) specialist and career coach with 15+ years of experience in technical recruiting. Your task is to perform a comprehensive analysis of a resume against a specific job description.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${resumeText.substring(0, 4000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB DESCRIPTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${jobDescription.substring(0, 2000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analyze the resume against the job description and return ONLY a raw JSON object (no markdown fences, no backticks, no explanation text before or after). Use exactly this structure:

{
  "atsScore": <integer 0-100>,
  "matchingSkills": <array of 5-15 specific skills/technologies found in both resume and JD>,
  "missingKeywords": <array of 5-15 important keywords from JD that are absent from resume>,
  "strengths": <array of 4-8 specific resume strengths relevant to this role>,
  "weaknesses": <array of 3-6 specific gaps or weaknesses in the resume for this role>,
  "suggestions": <array of 5-10 specific, actionable bullet-point suggestions to improve the resume>,
  "recommendedTechnicalSkills": <array of 5-8 technical skills to add or emphasize>,
  "recommendedSoftSkills": <array of 4-6 soft skills relevant to this role>,
  "interviewTips": <array of 5-8 specific interview preparation tips for this role based on the JD>,
  "hiringReadinessSummary": <string: 2-3 sentences with an honest overall assessment>
}

ATS SCORING RUBRIC (be strict and accurate):
- Keyword alignment with JD (30 pts): Does the resume use exact or close matches to JD terminology?
- Skills coverage (25 pts): How many required/preferred skills are present?
- Relevant experience (25 pts): Does work history match the seniority and domain required?
- Resume quality & format (20 pts): Quantified achievements, ATS-friendly structure, clarity?

Be SPECIFIC. Reference actual content from both documents. Avoid generic advice.
Return ONLY the JSON object.
`;

// ── Response Validator ─────────────────────────────────────────────────────────
const validateAndNormalizeResult = (raw) => {
  // Required fields
  const required = [
    'atsScore', 'matchingSkills', 'missingKeywords',
    'strengths', 'weaknesses', 'suggestions',
  ];

  for (const field of required) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(`AI response missing required field: "${field}"`);
    }
  }

  // Clamp score to 0–100
  const atsScore = Math.max(0, Math.min(100, Math.round(Number(raw.atsScore))));
  if (isNaN(atsScore)) throw new Error('atsScore is not a valid number');

  // Ensure all array fields are arrays
  const arrayFields = [
    'matchingSkills', 'missingKeywords', 'strengths', 'weaknesses',
    'suggestions', 'recommendedTechnicalSkills',
    'recommendedSoftSkills', 'interviewTips',
  ];

  const result = { atsScore };
  for (const field of arrayFields) {
    result[field] = Array.isArray(raw[field])
      ? raw[field].filter((s) => typeof s === 'string' && s.trim())
      : [];
  }

  result.hiringReadinessSummary =
    typeof raw.hiringReadinessSummary === 'string'
      ? raw.hiringReadinessSummary.trim()
      : 'Analysis complete. Review the details above for specific recommendations.';

  return result;
};

// ── Clean AI Response ──────────────────────────────────────────────────────────
const cleanJsonResponse = (text) => {
  // Remove common markdown artifacts
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Find the first { and last } to extract JSON
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('No valid JSON object found in AI response');
  }

  return cleaned.substring(start, end + 1);
};

// ── Main Analysis Function ─────────────────────────────────────────────────────
/**
 * Analyze a resume against a job description using Gemini AI.
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} Structured analysis result
 */
const analyzeResumeWithAI = async (resumeText, jobDescription) => {
  const prompt = buildAnalysisPrompt(resumeText, jobDescription);

  // ── Try Gemini ─────────────────────────────────────────────────────────────
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    const cleanedJson = cleanJsonResponse(rawText);
    const parsed = JSON.parse(cleanedJson);
    return validateAndNormalizeResult(parsed);

  } catch (geminiError) {
    console.error('Gemini analysis failed:', geminiError.message);

    // ── Fallback: OpenAI ────────────────────────────────────────────────────
    if (process.env.OPENAI_API_KEY) {
      console.log('Falling back to OpenAI...');
      return analyzeWithOpenAI(resumeText, jobDescription, prompt);
    }

    // Re-throw with a user-friendly message
    if (geminiError.message.includes('API_KEY')) {
      throw new Error('AI service is not configured. Please check your GEMINI_API_KEY.');
    }
    if (geminiError.message.includes('quota') || geminiError.message.includes('429')) {
      throw new Error('AI service rate limit reached. Please try again in a few minutes.');
    }

    throw new Error(`AI analysis failed: ${geminiError.message}`);
  }
};

// ── OpenAI Fallback ────────────────────────────────────────────────────────────
const analyzeWithOpenAI = async (resumeText, jobDescription, prompt) => {
  try {
    // Dynamic import to avoid errors when OpenAI isn't installed
    const { default: OpenAI } = await import('openai').catch(() => {
      throw new Error('OpenAI package not installed. Run: npm install openai');
    });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const rawText = completion.choices[0].message.content;
    const parsed = JSON.parse(rawText);
    return validateAndNormalizeResult(parsed);

  } catch (error) {
    throw new Error(`OpenAI fallback also failed: ${error.message}`);
  }
};

module.exports = { analyzeResumeWithAI };