import { observable } from 'mobx';

const currentStore = observable({
  isCommentModalUp: false,

  setIsCommentModalUp(state: boolean) {
    this.isCommentModalUp = state;
  },
});

export default currentStore;
