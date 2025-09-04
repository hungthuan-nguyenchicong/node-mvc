// backend/ssr/testSsr.js
function testSsr() {
    return `<p>test ssr<p>
    <script type="module" src="./mainSsr.js"></script>
    `
}

export {testSsr}