export default {
  state: {
    boardCategories: {},
    popularSearchWords: [],
    searchResult: {
      articleResult: {
        articles: []
      },
      commentResult: {
        comments: []
      },
      galleryResult: {
        galleries: []
      }
    }
  },
  mutations: {
    popularSearchWords(state, popularSearchWords) {
      state.popularSearchWords = popularSearchWords;
    },
    searchResult(state, searchResult) {
      state.searchResult = searchResult;
    },
    boardCategories(state, {id, categories}) {
      state.boardCategories[id] = categories;
    }
  }
};
