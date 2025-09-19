// frontend/src/admin/libery/upload-file/parts/upload-tab.js

function uploadTab(uploadContent) {
    document.addEventListener('upload-tab-link', (e) => {
        const currentTab = e.detail.tabId;
        //console.log(currentTab)
        // Add 'active' class to the correct tab button
        // const targetBtn = uploadContent.querySelector(`.tab-links[data-tab-content=${currentTab}]`);
        // if (targetBtn) {
        //     targetBtn.classList.add('active');
        // }
        const tabLinks = uploadContent.querySelectorAll('.tab-links');
        const tabContents = uploadContent.querySelectorAll('.tab-contents');

        // active btn tab-links
        tabLinks.forEach(tablink => {
            if (tablink.getAttribute('data-tab-link') === currentTab) {
                tablink.classList.add('active');
            } else {
                tablink.classList.remove('active');
            }
        });

        // active dev .tab-contents
        tabContents.forEach(tabContent => {
            if (tabContent.getAttribute('data-tab-content') === currentTab) {
                tabContent.classList.add('active');
            } else {
                tabContent.classList.remove('active');
            }
        });
    })
    // click btn tab-links
    clickBtnTabLinks(uploadContent)
}

function clickBtnTabLinks(uploadContent) {
    const tabBtns = uploadContent.querySelectorAll('.tab-links');
    const tabContents = uploadContent.querySelectorAll('.tab-contents');
    tabBtns.forEach(tabBtn => {
        tabBtn.addEventListener('click', (e) => {
            const targetTab = tabBtn.getAttribute('data-tab-link');
            // remove all active
            tabBtns.forEach(tabBtn => {
                tabBtn.classList.remove('active');
            });
            e.target.classList.add('active');

            tabContents.forEach(tabContent => {
                if (tabContent.getAttribute('data-tab-content') === targetTab) {
                    tabContent.classList.add('active');
                } else {
                    tabContent.classList.remove('active');
                }
            });
        });
    });
}

export { uploadTab }