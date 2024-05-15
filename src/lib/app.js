/**
 * @typedef Link
 * @property {number} start
 * @property {number} end
 */

/**
 * @typedef BooleanNode
 * @property {boolean} value
 */

class IO {
  /**
   * creates an input and output class that transforms a boolean input list into boolean output list
   * @param {number} numberOfInputs - the number of inputs
   * @param {number} numberOfOutputs - the number of outputs
   * @param {(inputs: boolean[]) => boolean[]} executeFn - the execute function to call on inputs
   */
  constructor(numberOfInputs, numberOfOutputs, executeFn) {
    this.numberOfInputs = numberOfInputs;
    this.numberOfOutputs = numberOfOutputs;
    this.executeFn = executeFn;
  }

  /**
   * the execute function to handle the transformation
   * @param {boolean[]} inputs - the inputs
   * @returns {boolean[]}
   */
  execute(inputs) {
    if (inputs.length !== this.numberOfInputs) {
      throw new Error("incorrect input length");
    }
    
    const outputs = this.executeFn(inputs);
    if (outputs.length !== this.numberOfOutputs) {
      throw new Error("incorrect output length");
    }

    return outputs;
  }
}

// primitives
const and = new IO(2, 1, ([a, b]) => [a && b]);
const or = new IO(2, 1, ([a, b]) => [a || b]);
const not = new IO(1, 1, ([a]) => [!a]);


/**
 * making a simple circuit
 * 
 * not0 -
 *        \
 *          and0
 *        /
 * not1 -
 */


/**
 * @typedef CircuitIO
 * @property {number} nodeIndex - the nodeIndex to get the inputs and the outputs
 * @property {IO} io - the io to run on the inputs and set the results of the function to the outputs
 */

/**
 * stores the noteIndex, which is the index to calculate the node inputs indexes and set the node outputs by using the numberOfInputs and numberOfOutputs in the io, and io which is the io to run.
 * @type {CircuitIO[]}
 */
const circuitIos = [];

/**
 * all the nodes in the circuit
 * @type {boolean[]}
 */
const nodes = [];

/**
 * to store all the links between the nodes in the circuit
 * @type {Link[]}
 */
const links = [];

// i(n) - stands for input with index n
// o(n) - stands for output with index n

links.push({ start: 2, end: 4 }); // not0 o0 - and0 i0
links.push({ start: 3, end: 5 }); // not1 o0 - and0 i1

/**
 * 
 * @param {IO} io - the io to add to circuitIos
 */
function addIo(io) {
  // calculate the size of nodes that is occuping the nodes list
  const sizeOfNodes = io.numberOfInputs + io.numberOfOutputs
  for (let i = 0; i < sizeOfNodes; i++) {
    nodes.push(false);
  }
  
  if (circuitIos.length === 0) {
    circuitIos.push({ nodeIndex: 0, io });
  } else {
    const lastIndex = circuitIos.length - 1; // get the last index of the circuitIos array
    const lastCircuitIo = circuitIos[lastIndex]; // the last cicuit io
    const lastSizeOfNodes = lastCircuitIo.io.numberOfInputs + lastCircuitIo.io.numberOfOutputs; // the size of the nodes that is occuping
    circuitIos.push({
      nodeIndex: lastCircuitIo.nodeIndex + lastSizeOfNodes, // offset it by adding the node index of last circuit io and the size it is occupying of the nodes
      io
    });
  }
}

/**
 * 
 * @param {CircuitIO} param - the circuit io to run on
 */
function run({nodeIndex, io}) {
  /**
   * @type {boolean[]}
   */
  const inputs = []
  for (let i = 0; i < io.numberOfInputs; i++) {
    // the node index
    const offset = nodeIndex + i;

    // push the value from the nodes into the inputs list
    inputs.push(nodes[offset]);
  }

  // get the outputs
  const outputs = io.execute(inputs);

  for (let i = 0; i < io.numberOfOutputs; i++) {
    // the node index
    const offset = nodeIndex + io.numberOfInputs + i;

    // set the outputs to the nodes
    nodes[offset] = outputs[i];
  }
}

/**
 * asserts value
 * @template T
 * @param {T} value - the value to assert
 * @param {T} expect - the expected value
 */
function assert(value, expect) {
  // check if the value is what expected
  if (value !== expect) {
    // throw error when not expected
    throw new Error(`got value expected ${expect}`)
  }

  // print out the test was passed
  console.log(`test passed for ${value} === ${expect}`);
}


addIo(not) // add not0
addIo(not) // add not1
addIo(and) // add and0

run(circuitIos[0]); // run not0
assert(nodes[1], true) // check if not0 [false] === true

run(circuitIos[1]); // run not1
assert(nodes[3], true) // check if not1 [false] === true

// check the links of 2 to 4
nodes[4] = nodes[1];

// check the links of 3 to 5
nodes[5] = nodes[3];

run(circuitIos[2]) // run and0
assert(nodes[6], true); // check if and0 [true, true] === true

