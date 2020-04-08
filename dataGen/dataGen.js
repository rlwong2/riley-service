const faker = require('faker');
const fs = require('fs');
const perf = require('execution-time')();

const uuid  = require('uuid');


const writeUsers = fs.createWriteStream('./dataGen/data/list_no_UUID.tsv')

const uuid  = require('uuid');

writeUsers.write('id\ttitle\tdescription\tphotos\n', 'utf8');  // write headers
// writeUsers.write('uuid\ttitle\tdescription\tphotos\n', 'utf8');  // write headers

function writeTenMillionUsers(writer, encoding, callback) {
  // perf.start();

  let i = 10000000;
  let j = 0;
  let onePercent = i / 100;
  function write() {
    let ok = true;
    do {
      i -= 1;
      j += 1;

      if (j % onePercent === 0) {
        console.log((j / onePercent), '%')
      }

      // const uniqueId = uuid.v4();
      const title = faker.lorem.sentence();
      const description = faker.lorem.sentence() + ' ' + faker.lorem.sentence();
      const photosArr = [];
      const p = Math.floor(Math.random() * 5) + 1;
      for (var k = 0; k < p; k++ ) {
        let padded = (Math.ceil(Math.random() * 1500)).toString().padStart(4, '0');
        photosArr.push(`/photo-${padded}.jpg`)
      }

      // const photos = JSON.stringify(photosArr)
      // const data = `${uniqueId}\t${title}\t${description}\t${photos}\n`;
      const data = `${j}\t${title}\t${description}\t${photosArr}\n`;

      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
// see if we should continue, or wait
// don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
// had to stop early!
// write some more once it drains
      writer.once('drain', write);
    }
    // const results = perf.stop();
    // console.log(results.time)
  }
write()

}




writeTenMillionUsers(writeUsers, 'utf-8', () => {
  console.log('Finished data generation')
  var stats = fs.statSync('./dataGen/data/list.tsv');
  var fileSizeB = stats["size"];
  var fileSizeMB = fileSizeB / 1000000.0

  console.log('file size: ' + Math.floor(fileSizeMB) + 'MB')
  writeUsers.end();
});