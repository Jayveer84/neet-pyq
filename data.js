/* ===============================
   AI QUESTION GENERATOR
=============================== */

async function generateAIQuestions() {

    // API KEY
    const apiKey =
        document.getElementById(
            "apiKeyInput"
        ).value;

    // Validation
    if (!apiKey) {

        alert(
            "Please enter Gemini API Key"
        );

        return;
    }

    // Chapter
    const chapter =
        document.getElementById(
            "chapterSelector"
        ).value;

    // Question Count
    const count =
        parseInt(
            document.getElementById(
                "questionCount"
            ).value
        );

    // AI Prompt
    const prompt = `
Generate ${count} NEET Biology MCQs
from chapter "${chapter}".

Rules:
- NEET level questions
- 4 options
- Only one correct answer
- Mix conceptual and NCERT style

Return ONLY valid JSON array.

Format:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct option"
  }
]
`;

    try {

        // Loading UI
        document.getElementById(
            "questions-viewport"
        ).innerHTML = `
            <div class="q-card">
                Generating AI Questions...
            </div>
        `;

        // API CALL
        const response =
            await fetch(

                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,

                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        contents: [

                            {
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

        // Convert Response
        const data =
            await response.json();

        console.log(data);

        // Error Handling
        if (data.error) {

            alert(
                data.error.message
            );

            return;
        }

        // Extract AI Text
        const rawText =
            data.candidates[0]
            .content.parts[0].text;

        // Clean Markdown
        const cleanedText =
            rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Convert JSON
        const aiQuestions =
            JSON.parse(cleanedText);

        // Render Questions
        renderAIQuestions(aiQuestions);

    }

    catch(error) {

        console.error(error);

        alert(
            "AI generation failed"
        );
    }
}

/* ===============================
   RENDER QUESTIONS
=============================== */

function renderAIQuestions(questionList) {

    const qViewport =
        document.getElementById(
            "questions-viewport"
        );

    const aViewport =
        document.getElementById(
            "answers-viewport"
        );

    qViewport.innerHTML = "";

    aViewport.innerHTML = "";

    // Loop Questions
    questionList.forEach((q, index) => {

        qViewport.innerHTML += `

            <div class="q-card">

                <div class="q-meta">

                    AI Question
                    ${index + 1}

                </div>

                <div class="q-text">

                    ${q.question}

                </div>

                <div class="options-grid">

                    ${q.options.map(option => `

                        <div
                            class="option-item"

                            onclick="
                                checkAnswer(
                                    this,
                                    '${option.replace(/'/g, "\\'")}',
                                    '${q.answer.replace(/'/g, "\\'")}'
                                )
                            "
                        >

                            ${option}

                        </div>

                    `).join("")}

                </div>

            </div>

        `;

        // Answer Sheet
        aViewport.innerHTML += `

            <div class="ans-pill">

                Q${index + 1}:
                ${q.answer}

            </div>

        `;
    });
}

/* ===============================
   CHECK ANSWER
=============================== */

function checkAnswer(
    element,
    selected,
    correct
) {

    const parent =
        element.parentElement;

    const allOptions =
        parent.querySelectorAll(
            ".option-item"
        );

    // Disable Multiple Clicks
    allOptions.forEach(opt => {

        opt.style.pointerEvents =
            "none";

        // Highlight Correct
        if (
            opt.innerText.trim() ===
            correct.trim()
        ) {

            opt.style.background =
                "#c8e6c9";

            opt.style.border =
                "2px solid green";
        }
    });

    // Correct
    if (
        selected.trim() ===
        correct.trim()
    ) {

        element.style.background =
            "#a5d6a7";

        element.innerHTML +=
            " ✅ Correct";
    }

    // Wrong
    else {

        element.style.background =
            "#ffcdd2";

        element.style.border =
            "2px solid red";

        element.innerHTML +=
            " ❌ Wrong";
    }
}

/* ===============================
   TOGGLE ANSWERS
=============================== */

function toggleAnswers() {

    const box =
        document.getElementById(
            "answerSheetBox"
        );

    if (
        box.style.display ===
        "block"
    ) {

        box.style.display =
            "none";
    }

    else {

        box.style.display =
            "block";

        box.scrollIntoView({
            behavior: "smooth"
        });
    }
}
