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
        tabLinks.forEach(tablink => {
            if (tablink.getAttribute('data-tab-content') === currentTab) {
                tablink.classList.add('active');
            } else {
                tablink.classList.remove('active');
            }
        });
    })
    // click btn tab-links
    clickBtnTabLinks(uploadContent)
}

function clickBtnTabLinks(uploadContent) {
    const tabBtns = uploadContent.querySelectorAll('.tab-links');
    tabBtns.forEach(tabBtn => {
        tabBtn.addEventListener('click', (e) => {
            // remove all active
            tabBtns.forEach(tabBtn => {
                tabBtn.classList.remove('active');
            });
            e.target.classList.add('active');
            const dataTabContent = e.target.getAttribute('data-tab-content');
            //console.log(dataTabContent)

            // remove all active
            const tabContents = uploadContent.querySelectorAll('.tab-contents');
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active');
            })
            // Finally, find the content div that matches the data attribute and add 'active'
            const targetContent = document.getElementById(dataTabContent);
            if (targetContent) {
                targetContent.classList.add('active');
            }

        });
    });
}

export { uploadTab }