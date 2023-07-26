// import { observable } from 'mobx';

// const currentStore = observable({
//   isCommentModalUp: false,

//   setIsCommentModalUp(state: boolean) {
//     this.isCommentModalUp = state;
//   },
// });

// export default currentStore;

import { action, makeObservable, observable } from 'mobx';

class Current {
  isCommentModalUp: boolean = false;

  constructor() {
    makeObservable(this, {
      isCommentModalUp: observable,
      setIsCommentModalUp: action,
    });
  }

  setIsCommentModalUp(state: boolean) {
    this.isCommentModalUp = state;
  }
}

const currentStore = new Current();
export default currentStore;
