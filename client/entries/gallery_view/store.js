export default {
  state: {
    image: {
      id: '',
      numberOfLike: 0,
      numberOfDislike: 0,
      writer: {}
    },
    next: {},
    prev: {},
    linkedPosts: []
  },
  mutations: {
    image(state, {gallery, next, prev, linkedPosts}) {
      state.image = gallery;
      state.next = next;
      state.prev = prev;
      state.linkedPosts = linkedPosts;
    },
    feeling(state, {myFeeling, numberOfLike, numberOfDislike}) {
      state.image.myFeeling = myFeeling;
      state.image.numberOfLike = numberOfLike;
      state.image.numberOfDislike = numberOfDislike;
    }
  }
};
