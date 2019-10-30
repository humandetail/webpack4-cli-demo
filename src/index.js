import './styles/index.scss'

const test = async (a, b) => {
  console.log(a, b);
  let c = await a + b;
  console.log(c);
}

test(1, 2);

alert(1)