import mocha from 'mocha';
import recursive from 'recursive-readdir';

// Mocha Instance
const suite = new mocha();

// Get all tests
const filesIgnore = ['*.js.map', '*.controller.js', '*.model.js', '*.routes.js'];
recursive('dist/api', filesIgnore, (err, files) => {
  console.log(files);

  files.forEach((file) => {
    suite.addFile(file);
  });

  suite.run((failures) => {
    process.exit(failures);
  });
});
