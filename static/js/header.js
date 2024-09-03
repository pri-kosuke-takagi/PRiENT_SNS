import { getUserByKey } from './utils/getObjectByKeys/getUserByKey.js';
import { createClassifiedUsers } from './utils/createClassifiedUsers.js';

const headerDiv = document.getElementById('header-div');

// 検索ボタンが表示された時に呼び出される関数。
const handledSearchButtonClicked = (e, classifiedLoggedInUser) => {

    const users = JSON.parse(localStorage.getItem('users'));

    e.preventDefault();
    // もうすでに検索モーダルが表示されている場合は、何もしない。
    if (document.getElementById('search-modal')) {
        return;
    }
    const userIdOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.id : null;

    const searchModal = document.createElement('div');
    searchModal.classList.add('search-modal');
    searchModal.id = 'search-modal';
    const searchModalButtons = document.createElement('div');
    searchModalButtons.classList.add('search-buttons-div', 'd-flex', 'gap-1', 'align-items-center', 'p-2', 'w-100');
    const searchModalButtonsDiv = document.createElement('div');
    searchModalButtonsDiv.classList.add('flex-grow-1', 'd-flex', 'align-items-center', 'justify-content-center', 'gap-2');

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Search...';

    searchModalButtonsDiv.appendChild(searchInput);

    const closeModalButton = document.createElement('span');
    closeModalButton.textContent = '閉じる';
    closeModalButton.classList.add('close-button');
    searchModalButtons.appendChild(searchModalButtonsDiv);
    searchModalButtons.appendChild(closeModalButton);

    searchModal.appendChild(searchModalButtons);

    // 検索結果部分にユーザを表示する。
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';

    const classifiedUsers = createClassifiedUsers(users);
    classifiedUsers.forEach(user => {
        if (user.id === userIdOfLoggedInUser) {
            return;
        }
        const userElement = user.createProfileInSearchModal(classifiedLoggedInUser);
        searchResults.appendChild(userElement);
    })

    searchModal.appendChild(searchResults);

    // 検索インプットのイベントリスナーを追加する。
    searchInput.addEventListener('input', () => {
        searchResults.innerHTML = '';
        classifiedUsers.forEach(user => {
            if (user.id === userIdOfLoggedInUser) {
                return;
            }
            // ユーザの名前、アカウント名、Bio(プロファイルメッセージ)のどれかに検索ワードが含まれている場合、ユーザを表示する。
            if (user.firstName.toLowerCase().includes(searchInput.value.toLowerCase())
                || user.lastName.toLowerCase().includes(searchInput.value.toLowerCase())
                || user.accountName.toLowerCase().includes(searchInput.value.toLowerCase())
                || user.bio.toLowerCase().includes(searchInput.value.toLowerCase())) {
                const userElement = user.createProfileInSearchModal(classifiedLoggedInUser);
                searchResults.appendChild(userElement);
            }
        });
    });

    // クローズボタンのイベントリスナーを追加する。
    // const closeModalButton = searchModal.querySelector('.close-button');
    closeModalButton.addEventListener('click', () => {
        searchModal.remove();
    });

    headerDiv.after(searchModal);

    // ESCキーを押したときに、検索モーダルを閉じる。
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal.remove();
        }
    });
}

/**
 * ナビゲーションバーを生成する関数。
 */
function createNavbar() {

    // ログインユーザを取得する。
    const loggedInUserId = sessionStorage.getItem('userId');
    let classifiedLoggedInUser = null;
    if (loggedInUserId) {
        classifiedLoggedInUser = getUserByKey(Number(loggedInUserId), 'id', true);
    }

    // メインとなるナビゲーションバー
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar', 'navbar-expand-sm', 'navbar-dark', 'bg-dark', 'flex-column');

    // ナビバーブランド
    const brand = document.createElement('a');
    brand.classList.add('navbar-brand');
    brand.href = '#';
    brand.textContent = 'PRiENT SNS';
    navbar.appendChild(brand);

    // ナビゲーショントグラー
    const toggler = document.createElement('button');
    toggler.classList.add('navbar-toggler', 'd-lg-none');
    toggler.type = 'button';
    toggler.setAttribute('data-bs-toggle', 'collapse');
    toggler.setAttribute('data-bs-target', '#collapsibleNavId');
    toggler.setAttribute('aria-controls', 'collapsibleNavId');
    toggler.setAttribute('aria-expanded', 'false');
    toggler.setAttribute('aria-label', 'Toggle navigation');
    navbar.appendChild(toggler);

    // ナビゲーションアイテムを格納するコンテナ
    const collapse = document.createElement('div');
    collapse.classList.add('collapse', 'navbar-collapse', 'flex-column');
    collapse.id = 'collapsibleNavId';
    navbar.appendChild(collapse);

    // ナビゲーションアイテムを格納するリスト
    const nav = document.createElement('ul');
    nav.classList.add('navbar-nav', 'me-auto', 'mt-2', 'mt-lg-0', 'flex-column');
    collapse.appendChild(nav);

    // ナビゲーションアイテム
    const navItems = [
        { href: '/html/home.html', text: 'Home', isAboutUser: false },
        { href: '/html/post.html', text: '投稿作成', isAboutUser: false },
        { href: '/html/login.html', text: 'ログアウト', isAboutUser: true },
        { href: '/html/register.html', text: 'ユーザ登録', isAboutUser: true },
        { href: '/html/saved_posts.html', text: '保存済み投稿', isAboutUser: true },
        { href: '/html/profile.html', text: 'ユーザプロファイル', isAboutUser: true },
        { href: '/html/privacy_policy.html', text: 'プライバシーポリシー', isAboutUser: false },
        { href: '/html/terms_of_use.html', text: '利用規約', isAboutUser: false },
        { href: '/html/specified_commercial_transaction.html', text: '特定商取引法', isAboutUser: false },
        { href: '/html/faq.html', text: 'よくある質問', isAboutUser: false },
        { href: '#', text: `${classifiedLoggedInUser.accountName}`, dropdown: true, isAboutUser: false },
    ];

    navItems.forEach(item => {

        // URLの末尾から現在のページを取得する。
        const currentPage = location.href.split('/').pop();
        item.active = item.href.includes(currentPage);

        // liタグを生成
        const li = document.createElement('li');
        li.classList.add('nav-item');
        nav.appendChild(li);

        // anchorタグを生成 (ログアウトボタンの場合はbuttonタグを生成)
        const a = document.createElement('a');
        a.classList.add('nav-link');
        a.href = item.href;
        a.textContent = item.text;

        // item.activeがtrueの場合は、そのページにいることを意味するので、activeクラスを追加する。
        if (item.active) {
            a.classList.add('active');
        }

        // ドロップダウンメニューの場合の処理
        if (item.dropdown) {
            a.classList.add('dropdown-toggle');
            a.setAttribute('id', 'dropdownId');
            a.setAttribute('data-bs-toggle', 'dropdown');
            a.setAttribute('aria-haspopup', 'true');
            a.setAttribute('aria-expanded', 'false');

            const dropdown = document.createElement('div');
            dropdown.classList.add('dropdown-menu');
            dropdown.setAttribute('aria-labelledby', 'dropdownId');
            li.appendChild(dropdown);

            const dropdownItems = navItems.filter(item => item.isAboutUser);

            dropdownItems.forEach(dropdownItem => {

                let dropdownItemElement = null;

                // ログアウトボタンが押された時の処理
                if (dropdownItem.text === 'ログアウト') {
                    dropdownItemElement = document.createElement('button');
                    dropdownItemElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        classifiedLoggedInUser.logout();
                        window.location.href = '/html/login.html';
                    });
                } else {
                    dropdownItemElement = document.createElement('a');
                    dropdownItemElement.href = dropdownItem.href;
                }

                dropdownItemElement.textContent = dropdownItem.text;
                dropdownItemElement.classList.add('dropdown-item');
                dropdown.appendChild(dropdownItemElement);
            });
        }

        // ユーザ関連のリンクは、ドロップダウンメニューに表示させる。
        if (!item.isAboutUser) {
            li.appendChild(a);
        }
    });

    // Searchボタン
    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.classList.add('btn', 'btn-outline-success', 'my-2', 'my-sm-0');
    searchButton.type = 'button';
    searchButton.textContent = '検索';
    collapse.appendChild(searchButton);

    searchButton.addEventListener('click', (e) => {
        handledSearchButtonClicked(e, classifiedLoggedInUser);
    });

    return navbar;
}


const initializeHeader = () => {
    console.log('header.js is loaded');

    headerDiv.appendChild(createNavbar());
}

initializeHeader();