<div id="box">
    <a id="a1" href='#'>a1</a>
    <a id="a2" href='#'>a2</a>
    <a id="a3" href='#'>a3</a>
    <a id="a4" href='#'>a4</a>
    <a id="a5" href='#'>a5</a>
    <a id="a6" href='#'>a6</a>
    <button type="button" id='addA'>增加a标签</button>
</div>



function bindEvent(element, type, selector, fn) {
    if (fn === null) {
        fn = selector;
        selector = null;
    }

    element.addEventListener(type, (event) => {
        const target = event.target;

        if (selector) {
            if (target.matches(selector)) {
                fn && fn.call(target, event);
            }
        } else {
            fn && fn.call(target, event);
        }
    });
}

var parent = document.getElementById("box");
bindEvent(parent, "click", "A", (event) => {
    event.preventDefault();
    const target = event.target;

    console.log(target.matches("A"))
});
