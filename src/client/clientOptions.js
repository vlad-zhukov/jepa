const clientOptions = window.__JEPA_OPTIONS__;
delete window.__JEPA_OPTIONS__;
const clientOptionsContainer = document.getElementById('jepa-options');
if (clientOptionsContainer) {
    clientOptionsContainer.outerHTML = '';
}

export default clientOptions;
