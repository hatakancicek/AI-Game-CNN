const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

const model = tf.sequential();

model.add(
  tf.layers.conv2d({
    inputShape: [8, 8, 6],
    kernelSize: 3,
    filters: 32,
    strides: 1,
    activation: "relu",
    kernelInitializer: tf.initializers.glorotNormal()
  })
);

model.add(
  tf.layers.conv2d({
    kernelSize: 3,
    filters: 32,
    strides: 1,
    activation: "relu",
    kernelInitializer: tf.initializers.glorotNormal()
  })
);

model.add(
  tf.layers.conv2d({
    kernelSize: 3,
    filters: 32,
    strides: 1,
    activation: "relu",
    kernelInitializer: tf.initializers.glorotNormal()
  })
);

model.add(tf.layers.flatten());

model.add(tf.layers.dropout(0.5));

model.add(
  tf.layers.dense({
    units: 122,
    kernelInitializer: tf.initializers.glorotNormal(),
    activation: "softmax",
    useBias: true,
    biasInitializer: tf.initializers.zeros()
  })
);

const LEARNING_RATE = 0.001;
const optimizer = tf.train.adam(LEARNING_RATE);

model.compile({
  optimizer: optimizer,
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"]
});

const BATCH_SIZE = 100;

const testData = JSON.parse(fs.readFileSync("./testbatch.txt"));
const validationData = {
  states: [],
  labels: []
};

testData.forEach(({ state, action }) => {
  validationData.states.push(state);
  validationData.labels.push(action);
});

let train_acc = [];
let val_acc = [];
let train_loss = [];
let val_loss = [];

validationData.states = tf.tensor4d(validationData.states);
const vals = tf.tensor2d(validationData.labels);
(async function main() {
  const batch = {
    states: [],
    labels: []
  };

  const data = JSON.parse(fs.readFileSync("./train_large.txt"));

  data.forEach(({ state, action }) => {
    batch.states.push(state);
    batch.labels.push(action);
  });

  const xs = tf.tensor4d(batch.states);
  const ys = tf.tensor2d(batch.labels);

  await model.fit(xs, ys, {
    batchSize: BATCH_SIZE,
    validationData: [validationData.states, vals],
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        train_acc.push(logs.acc);
        val_acc.push(logs["val_acc"]);
        train_loss.push(logs.loss);
        val_loss.push(logs["val_loss"]);
        if (epoch === 50) model.optimizer.learningRate = 0.0001;
      }
    }
  });

  tf.dispose(xs);
  tf.dispose(ys);

  fs.writeFileSync(
    "./result_3_large.json",
    JSON.stringify({ train_acc, val_acc, train_loss, val_loss })
  );
})();
