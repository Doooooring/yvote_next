import { commentType } from '@utils/interface/news';
import { action, computed, makeObservable, observable } from 'mobx';

class Current {
  curComment : commentType | null = null;

  constructor() {
    makeObservable(this, {
      isCommentModalUp: computed,
      curComment : observable,
      openCommentModal : action,
      closeCommentModal : action
    });
  }

  get isCommentModalUp() {
    return this.curComment != null;
  }

  private setCurComment = (comment : commentType | null) => {
    this.curComment = comment;
  }

  openCommentModal = (comment : commentType) => {
    this.setCurComment(comment);
  }

  closeCommentModal = () => {
    this.setCurComment(null);
  }
}

const currentStore = new Current();
export default currentStore;
