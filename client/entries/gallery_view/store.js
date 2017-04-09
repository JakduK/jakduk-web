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
    linkedPosts: [],
    surroundingsGalleries: []
  },
  mutations: {
    image(state, {gallery, next, prev, linkedPosts, surroundingsGalleries}) {
      state.image = gallery;
      state.next = next;
      state.prev = prev;
      state.linkedPosts = linkedPosts;
      state.surroundingsGalleries = surroundingsGalleries;
    },
    feeling(state, {myFeeling, numberOfLike, numberOfDislike}) {
      state.image.myFeeling = myFeeling;
      state.image.numberOfLike = numberOfLike;
      state.image.numberOfDislike = numberOfDislike;
    }
  }
};
