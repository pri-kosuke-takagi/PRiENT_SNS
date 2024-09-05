
const containerDiv = document.getElementById('container-div');

function createFooter() {
    // メインとなるfooter要素を作成
    const footer = document.createElement('footer');

    // footerDivを作成
    const footerDiv = document.createElement('div');
    footerDiv.id = 'footer-div';
    footer.appendChild(footerDiv);

    // 各ページを格納するDivを作成
    const footerDivForPages = document.createElement('div');
    footerDivForPages.id = 'div-for-pages-in-footer';
    footerDiv.appendChild(footerDivForPages);

    // ナビゲーションバーを作成
    const footerNavbarNav = document.createElement('ul');
    footerNavbarNav.id = 'footer-navbar-nav';
    footerNavbarNav.classList.add('navbar-nav');
    footerDivForPages.appendChild(footerNavbarNav);

    // ナビゲーションアイテムを作成
    const navItems = [
        { href: '/views/html/faq.html', text: 'よくある質問', isAboutUser: false },
        { href: '/views/html/privacy_policy.html', text: 'プライバシーポリシー', isAboutUser: false },
        { href: '/views/html/terms_of_use.html', text: '利用規約', isAboutUser: false },
        { href: '/views/html/specified_commercial_transaction.html', text: '特定商取引法', isAboutUser: false },
    ];

    navItems.forEach(item => {

        // URLの末尾から現在のページを取得する。
        let endOfUrl = location.href.split('/').pop();
        if (endOfUrl.includes('#')) {
            endOfUrl = endOfUrl.split('#')[0];
        }
        if (endOfUrl.includes('?')) {
            endOfUrl = endOfUrl.split('?')[0];
        }
        item.active = item.href.includes(endOfUrl);

        const navItem = document.createElement('li');
        navItem.classList.add('nav-item');
        footerNavbarNav.appendChild(navItem);

        const navLink = document.createElement('a');
        navLink.classList.add('nav-link');
        navLink.href = item.href;
        navLink.textContent = item.text;

        // item.activeがtrueの場合は、そのページにいることを意味するので、activeクラスを追加する。
        if (item.active) {
            navLink.classList.add('active');
            navLink.setAttribute('aria-current', 'page');
        }

        navItem.appendChild(navLink);
    });

    // プロジェクト名を格納するDivを作成
    const footerDivForProjectName = document.createElement('div');
    footerDivForProjectName.id = 'footer-div-for-project-name';
    footerDiv.appendChild(footerDivForProjectName);

    // プロジェクト名を作成
    const projectNameParagraph = document.createElement('p');
    projectNameParagraph.textContent = '© 2024 PRiENT';
    footerDivForProjectName.appendChild(projectNameParagraph);

    // 作成したfooterを追加
    containerDiv.appendChild(footer);
}

// 関数呼び出し
createFooter();