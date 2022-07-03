//перечисляем Links
const defaultOptions = {
    linkClass: '.card',
};

const explosionClassName = 'explosion';
const explosionOpenedClassName = 'explosion_Opened';
const explosionOpeningClassName = 'explosion_Opening';

const explosionSummaryClassName = 'explosionSummary';
const explosionControlsClassName = 'explosionControls';
const explosionImagesClassName = 'explosionImages';

const explosionSummaryContentClassName = 'explosionSummaryContent';
const explosionTitleClassName = 'explosionTitle';
const explosionDescriptionClassName = 'explosionDescription';
const explosionImageClassName = 'explosionImage';

const explosionCloseClassName = 'explosionClose';
const explosionNavsClassName = 'explosionNavs';

const explosionNavClassName = 'explosionNav'; 
const explosionNavPrevClassName = 'explosionNavPrev';
const explosionNavNextClassName = 'explosionNavNext';
const explosionCouterClassName = 'explosionCounter';
const explosionNavDisabledClassName = 'explosionNavDisabled';

const explosionPrevHiddenImageClassName = 'explosionImage_PrevHidden';
const explosionPrevShowingImageClassName = 'explosionImage_PrevShowing';
const explosionActiveImageClassName = 'explosionImage_Active';
const explosionNextShowingImageClassName = 'explosionImage_NextShowing';
const explosionNextHiddenImageClassName = 'explosionImage_NextHidden';

class ExplositionGallery {
    constructor(elementNode, options) {
        this.options = {
            ...defaultOptions,
            ...options
        };
        // сохраняем elementNode
        this.containerNode = elementNode;
        //определяем linksNode
        this.linkNodes = elementNode.querySelectorAll(this.options.linkClass);
        // минимальная ширина и высота модального окна
        this.minWidth = 1023;
        this.minHeight = 600;
        // padding модального окна
        this.padding = 2 * 16;
        // количество images с лева и права от активной модального окна(контейнера)
        this.showingCount = 4;
        // индекс текущей image
        this.currentIndex = 0;
        //колличество total images
        this.size = this.linkNodes.length;
        //инициализируем модальное окно
        this.initModal();
        //определяем события 
        this.events();
    }
    
    // создаем окно и кладем в body
    initModal() {
        this.modalContainerNode = document.createElement('div');
        this.modalContainerNode.className = explosionClassName;
        
        this.modalContainerNode.innerHTML = `
            <div class="${explosionSummaryClassName}">
                <div class="${explosionSummaryContentClassName}">
                    <h2 class="${explosionTitleClassName}"></h2>
                    <p class="${explosionDescriptionClassName}"></p>
                </div>
            </div>
            <div class="${explosionControlsClassName}">
                <button class="${explosionCloseClassName}"></button>
                <div class="${explosionNavsClassName}">
                    <button class="${explosionNavClassName} ${explosionNavPrevClassName}"></button>
                    <div class="${explosionCouterClassName}">
                        1/${this.size}
                    </div>
                    <button class="${explosionNavClassName} ${explosionNavNextClassName}"></button>
                </div>
            </div>
            <div class="${explosionImagesClassName}">
                ${Array.from(this.linkNodes).map((linkNode) => `
                    <img src="${linkNode.getAttribute('href')}" alt="${linkNode.dataset.title}" class="${explosionImageClassName}" data-title="${linkNode.dataset.title}" data-description="${linkNode.dataset.description}"/>
                `).join('')}
            </div>
        `;

         document.body.appendChild(this.modalContainerNode)
    }

    // реализация событий
    events() {
        this.containerNode.addEventListener('click', this.activateGallery);
    }
    // активация галереи (стрелочная функция поэтому не теряем this)
    activateGallery = (event) => {
        event.preventDefault();
        //определяем клик по ссылке
        const linkNode = event.target.closest('a');

        if(!linkNode) {
            return;
        }

        // переопределяем текущий индекс image
        this.currentIndex = Array.from(this.linkNodes).findIndex((itemNode) => (linkNode === itemNode));
        
        // добовляем состояния модального окна
        this.modalContainerNode.classList.add(explosionOpeningClassName);

        fadeIn(this.modalContainerNode, () => {
            this.modalContainerNode.classList.remove(explosionOpeningClassName);
            this.modalContainerNode.classList.add(explosionOpenedClassName);
        });
    }
}

/**
 * Helpers
 */
function fadeIn(element, callback) {
    animation();

    function animation() {
        let opacity = Number(element.style.opacity);
        if (opacity < 1) {
            opacity = opacity + 0.1
            element.style.opacity = opacity;
            window.requestAnimationFrame(animation);
            return;
        }

        if (callback) {
            callback();
        }
    }
}

function fadeOut(element, callback) {
    animation();

    function animation() {
        let opacity = Number(element.style.opacity);
    
        if (opacity > 0) {
            opacity = opacity - 0.04
            element.style.opacity = opacity;
            window.requestAnimationFrame(animation);
            return;
        }

        if (callback) {
            callback();
        }
    }
}

function throttle(callback, delay = 200) {
    let isWaiting = false;
    let savedArgs = null;
    let savedThis = null;
    return function wrapper(...args) {
        if (isWaiting) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        callback.apply(this, args);

        isWaiting = true;
        setTimeout(() => {
            isWaiting = false;
            if (savedThis) {
                wrapper.apply(savedThis, savedArgs);
                savedThis = null;
                savedArgs = null;
            }
        }, delay);
    }
}


