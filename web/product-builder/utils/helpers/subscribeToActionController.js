function ActiveActionsController() {
  let activeActions = [];

  window.addEventListener('click', (event) => {  
    activeActions.map(item => {
      const toClose = item.target !== event.target
        && !item.target.contains(event.target)
        && item.opener !== event.target
        && (item.opener ? !item.opener.contains(event.target) : true);

      if (toClose) {
        item.callback();
        item.closed = true;
      }
  
      return item;
    });
  
    activeActions = activeActions.filter(item => !item.closed)
  })

  const addToActiveAction = ({ target, opener, callback }) => {
    activeActions.push({
      target,
      opener,
      callback
    })
  }

  return addToActiveAction
}
const subscribeToActionController = ActiveActionsController();

export default subscribeToActionController;