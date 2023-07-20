class Update {
  constructor(count, divs) {
    this.gap = 10;
    this.columnsHeights = new Array(count).fill(0);
    this.divs = divs;
  }

  get count() {
    return this.columnsHeights.length;
  }

  set count(val) {
    this.columnsHeights = new Array(val).fill(0);
  }

  #getMinHeightIndex() {
    let min = this.columnsHeights[0];
    let i = 0;

    this.columnsHeights.forEach((item, index) => {

      if (item < min) {
        min = item;
        i = index;
      }
    });

    return i;
  }

  #getMinHeight = () => Math.min(...this.columnsHeights); 	// 获取所有列的最小高度值。

  setPosition() {
    for (let div of this.divs) {
      const minIndex = this.#getMinHeightIndex(); 	// 获取所有列的最小高度值的索引。
      const minHeight = this.#getMinHeight();

      div.style.top = `${minHeight}px`;
      div.style.left = `${minIndex * div.offsetWidth + this.gap * minIndex}px`;
      this.columnsHeights[minIndex] += div.offsetHeight + this.gap;
    }
  }
}

// const tag = "div";
// const createElementNumber = 100; // 创建50个元素
// const rootElement = document.querySelector("#app");

// const tagLists = new CreateElement(tag, createElementNumber).nodeLists;
// tagLists.forEach((tagList) => rootElement.appendChild(tagList));
// // ********************************************************************************

/**
 * 创建一个瀑布流布局
 * @param {HTMLElement[]} elements 
 * @param {number | "auto"} colsWidth 
 */
function createWaterfallFlow(elements, colsWidth) {
  if (elements.length === 0 || colsWidth === 0) {
    return;
  }
  const rootElement = elements[0].parentElement;

  const elementWidth = elements[0].offsetWidth; // 得到每个div 的宽度
  let count = colsWidth == "auto" ? Math.floor(window.innerWidth / elementWidth) : Number(colsWidth);

  const update = new Update(count, elements);
  update.setPosition();
  rootElement.style.width = `${update.count * elementWidth + (update.count - 1) * update.gap}px`;
  // ********************************************************************************

  let timer = null;
  window.onresize = function () {
    // 节流
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      update.count = Math.floor(window.innerWidth / elementWidth); // 改变每列的宽度
      update.setPosition(); // 重新设置位置

      rootElement.style.width = `${update.count * elementWidth + (update.count - 1) * update.gap
        }px`;
    }, 1000);
  };
}


/**
 * 
 * @param {HTMLElement[]} elements 
 */
function setRandomHeight(elements) {
  elements.forEach(element => {
    element.style.setProperty("--h", (Math.random() * 100 + 20) + "px");
  })
}

function containerElement(elements, tag) {
  if (!tag) {
    return;
  }
  const parentEle = document.createElement(tag);
  elements.forEach((el) => parentEle.appendChild(el));

  return parentEle;

}

/**
 * 过滤指定大小的元素
 * @type { {minWidth:number, minHeight: number} } Options
 * @param {HTMLElement[]} elements 
 * @param {Options} filterCondition 
 */
function filterElement(elements, filterCondition = { minWidth: 400, minHeight: 400 }) {
  return elements.filter(ele => ele.offsetWidth > filterCondition.minWidth && ele.offsetHeight > filterCondition.minHeight);
}