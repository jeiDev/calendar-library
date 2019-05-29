var domlast;

/**
 * 
 * @param {String} tag 
 * @param {[String] | String} classList 
 * @param {HTMLElement} parent 
 * @returns {HTMLElement}
 */
function dom(tag, parent = document.body, classList = []){
    let el = document.createElement(tag);
    return domlast = parent.appendChild(Object.assign(el, {className: (classList + '').replace(/\,/g, ' '), css: obj => (Object.assign(el, Object.assign(el.style, obj))), attr: obj => (Object.assign(el, obj)), setHTML: text => (Object.assign(el, {innerHTML: text}))}));
}