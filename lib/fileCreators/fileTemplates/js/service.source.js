"use strict";

const capitalize = require("../../../utils/capitalize");

exports.serviceSource = asset => `"use strict";

// NOTE: to implement multi document relationships, please read the commented out sections of code.
// Changes only need to happen to index${capitalize(asset)}() and show${capitalize(asset)}()
// methods, the other methods will work without modification as the reference arrays are
// imbedded on in request bodies directly.

const mongoose = require("mongoose");

// main model
const ${capitalize(asset)} = mongoose.model("${capitalize(asset)}");

// if you want to have multi document relationship, the commented out lines
// below are an example of imports you need to add for referencing to work.

// // referenced models
// const Book = mongoose.model("Book");
// const Hobby = mongoose.model("Hobby");

exports.index${capitalize(asset)} = async references => {
  try {

    let query = {};

    // if you want to have multi document relationship, uncommented the lines
    // below and send an array of references from the front end in a format:

    // references: [
    //   { ref: 'books', id: '5cc0024b1dfa620d8c16e336' },
    //   { ref: 'hobbies', id: '5cc0bc27a4f1992943633f1f' },
    // ]
    // NOTE: this asssumes that your reference arrays in ${capitalize(asset)} model schema are
    // called 'books' and 'hobbies'.

    // // for looking up any ${capitalize(asset)} that has a reference to a particular model
    // if (references)
    //   references.forEach(reference => {
    //     reference = JSON.parse(reference);
    //     query[reference.ref] = reference.id;
    //   });

    const ${asset} = await ${capitalize(asset)}.find(query);
    return ${asset};
  } catch (err) {
    return err;
  }
};

exports.create${capitalize(asset)} = async ${asset} => {
  try {
    const new${capitalize(asset)} = new ${capitalize(asset)}(${asset});
    const saved${capitalize(asset)} = await new${capitalize(asset)}.save();
    return saved${capitalize(asset)};
  } catch (err) {
    return err;
  }
};

exports.show${capitalize(asset)} = async ${asset}Id => {
  try {
    const ${asset} = await ${capitalize(asset)}.findById(${asset}Id);

    // if you want to have multi document relationship, the commented out lines
    // below are an example of imports you need to add for referencing to work.

    // ${asset} = ${asset}.toObject({ virtuals: true });
    // // prefer to make separate query over populate() to make sure that the
    // // 16 MB document size limit is not hit!

    // // replace references array with actual values
    // ${asset}.books = await Promise.all(${asset}.books.map(bookId => Book.findById(bookId)));
    // ${asset}.hobbies = await Promise.all(${asset}.hobbies.map(hobbyId => Hobby.findById(hobbyId)));

    return ${asset};
  } catch (err) {
    return err;
  }
};

exports.update${capitalize(asset)} = async (${asset}Id, new${capitalize(asset)}Body) => {
  try {
    const updated${capitalize(asset)} = await ${capitalize(
  asset
)}.findOneAndUpdate({ _id: ${asset}Id }, new${capitalize(asset)}Body, { new: true });
    return updated${capitalize(asset)};
  } catch (err) {
    return err;
  }
};

exports.delete${capitalize(asset)} = async ${asset}Id => {
  try {
    const result = await ${capitalize(asset)}.deleteOne({ _id: ${asset}Id });
    return { message: "${asset} successfully deleted", result };
  } catch (err) {
    return err;
  }
};    
`;
