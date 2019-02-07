const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const model = tf.sequential();

model.add(tf.layers.conv2d({
  inputShape: [8, 8, 6],
  kernelSize: 3,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: tf.initializers.glorotNormal(),
}));

model.add(tf.layers.conv2d({
  kernelSize: 3,
  filters: 12,
  strides: 1,
  activation: 'relu',
  kernelInitializer: tf.initializers.glorotNormal(),
}));


model.add(tf.layers.conv2d({
  kernelSize: 3,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: tf.initializers.glorotNormal(),
}));

model.add(tf.layers.flatten());

model.add(tf.layers.dense({
  units: 122,
  kernelInitializer: tf.initializers.glorotNormal(),
  activation: 'softmax',
  useBias: true,
}));

const LEARNING_RATE = 0.15;
const optimizer = tf.train.sgd(LEARNING_RATE);

model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

const BATCH_SIZE = 100;
const TEST_SIZE = 1000;

const TRAIN_BATCHES = 10000;

const testData = JSON.parse(fs.readFileSync("./testbatch.txt"));
const validationData = {
  states: [],
  labels: [],
};

testData.forEach(({ state, action }) => {
  validationData.states.push(state);
  validationData.labels.push(action);
});

validationData.states = tf.tensor4d(validationData.states);

(async function main() {
  for (let i = 0; i < TRAIN_BATCHES; i++) {
  
    const data = JSON.parse(fs.readFileSync("./batches/" + i + ".txt"));
    const batch = {
      states: [],
      labels: [],
    };
    
    data.forEach(({ state, action }) => {
      batch.states.push(state);
      batch.labels.push(action);
    });
  
    const history = await model.fit(
      tf.tensor4d(batch.states),
      tf.tensor2d(batch.labels),
      {
        batchSize: BATCH_SIZE,
        validationData: [validationData.states, tf.tensor2d(validationData.labels)],
        epochs: 1
      });


    console.log(i);
    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];

  };
})();