
function globalResize() {
  window.bodySize = document.body.offsetWidth >= 750 ? 'desktop' : 'mobile';

  let subscribedAdaptiveContent = [];

  const dispathAdaptive = (size, elem) => {
    const resizeEvent = new CustomEvent('body:resized', {
      detail: {
        size
      }
    });

    if (elem) {
      elem.dispatchEvent(resizeEvent);
      return;
    }

    subscribedAdaptiveContent.forEach(elem => elem.dispatchEvent(resizeEvent));
  }

  const windowResize = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const width = entry.contentRect.width;

      if (width < 750 && window.bodySize === 'mobile') {
        return;
      } else if (width < 750 && window.bodySize !== 'mobile') {
        window.bodySize = 'mobile';
        dispathAdaptive(window.bodySize);
      } else if (width > 750 && window.bodySize !== 'desktop') {
        window.bodySize = 'desktop';
        dispathAdaptive(window.bodySize);
      }
    });
  });
  windowResize.observe(document.body);

  return {
    subscribe: (elem, callback) => {
      subscribedAdaptiveContent.push(elem);

      if (callback) {
        elem.addEventListener('body:resized', callback);
      }

      dispathAdaptive(window.bodySize, elem);
    },
    unsubscribe: (elem) => {
      subscribedAdaptiveContent = subscribedAdaptiveContent
        .filter(item => item !== elem);
    }
  }
}
const adaptiveActions = globalResize();

export default adaptiveActions;