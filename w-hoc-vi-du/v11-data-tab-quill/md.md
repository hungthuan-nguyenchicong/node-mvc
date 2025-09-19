# Qill

## data-tab

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