beforeEach(function () {
    jasmine.addMatchers({
        toBeValidFeedListOfKey: function () {
           return {
               compare: function (act, exp) {
                   let valid = true;
                   for(let feed of act){
                       if(feed[exp] === null || feed[exp] === undefined || feed[exp].length === 0) {
                           valid = false;
                           break;
                       }
                   }
                   return {
                       pass: valid
                   };
               }
           };
       }
    });
});