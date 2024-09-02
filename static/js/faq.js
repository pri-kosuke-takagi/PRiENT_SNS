import { fetchFaqSampleData } from "./utils/fetchUtils/fetchFaqSampleData.js";

const faqDiv = document.getElementById('faq-div');
const searchButton = document.getElementById('search-button-div');
const searchInput = document.getElementById('floatingInputToSearchFaq');

/**
 * 各質問データを表示する
 */
const createDivForQuestion = (question) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-' + question.id);
    questionDiv.textContent = question.question;

    // 質問エレメントがクリックされたら回答を表示する
    questionDiv.addEventListener('click', (e) => {
        const target = e.target;
        const answerDiv = document.querySelector('.answer-' + question.id);
        answerDiv.classList.toggle('d-none');
    });

    return questionDiv;
}

/**
 * 各回答データを表示する
 */
const createDivForAnswer = (question) => {
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer-' + question.id, 'd-none');
    answerDiv.textContent = question.answer;
    return answerDiv;
}

/**
 * 各カテゴリデータを表示する
 */
const createDivForCategory = (category) => {
    const categoryUl = document.createElement('ul');
    categoryUl.classList.add('category-' + category.id);

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title-' + category.id);
    categoryTitle.textContent = category.category;
    
    categoryUl.appendChild(categoryTitle);
    return categoryUl;
}

/**
 * FAQデータを表示する。
 */
const displayFaq = (faqs) => {
    faqs.forEach(faq => {
        const categoryUl = createDivForCategory(faq);

        faq.questions.forEach(question => {
            const DivOfQA = document.createElement('li');
            DivOfQA.classList.add('qa-' + question.id, 'd-none');
            
            // 質問のエレメントを作りQAを格納するDivに追加
            DivOfQA.appendChild(createDivForQuestion(question));

            // 回答のエレメントを作りQAを格納するDivに追加
            DivOfQA.appendChild(createDivForAnswer(question));

            categoryUl.appendChild(DivOfQA);
        })

        // カテゴリエレメントにクリックイベントを追加
        categoryUl.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('category-' + faq.id)
            || target.classList.contains('category-title-' + faq.id)) {
                faq.questions.forEach(question => {
                    const qaDiv = document.querySelector('.qa-' + question.id);
                    qaDiv.classList.toggle('d-none');
                })
            }
        });

        faqDiv.appendChild(categoryUl);
    });
}

/**
 * 検索結果にマッチした質問データを表示する。
 */
const displayFaqMatchedToSearchResult = (searchResult) => {
    searchResult.forEach(r => {
        const qaDiv = document.querySelector('.qa-' + r.questionId);
        qaDiv.classList.remove('d-none');

        const questionDiv = document.querySelector('.question-' + r.questionId);

        const answerDiv = document.querySelector('.answer-' + r.questionId);
        answerDiv.classList.remove('d-none');
    });
}

/**
 * Searchボタンが押された時の処理
 */
const handleSearchButtonClicked = (e, faqs) => {
    const searchWord = searchInput.value;

    const searchResult = [];

    faqs.forEach(faq => {
        faq.questions.forEach(q => {
            if (q.question.toLowerCase().includes(searchWord.toLowerCase()) || q.answer.toLowerCase().includes(searchWord.toLowerCase())) {
                const resultObj = {
                    categoryId: faq.id,
                    questionId: q.id,
                    question: q.question,
                    answer: q.answer
                }
                searchResult.push(resultObj);
            }
        })
    })

    console.log('searchResult: ', searchResult);
    displayFaqMatchedToSearchResult(searchResult);
}

window.onload = async () => {

    console.log('faq.js loaded');

    // FAQデータをローカルストレージから取得する。
    let faqs = localStorage.getItem('faqs') ? JSON.parse(localStorage.getItem('faqs')) : await fetchFaqSampleData();
    localStorage.setItem('faqs', JSON.stringify(faqs));
    console.log('This is faqs: ', faqs);

    // FAQデータを表示する。
    displayFaq(faqs);

    // Searchボタンが押された時の処理を追加
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearchButtonClicked(e, faqs);
    });
}