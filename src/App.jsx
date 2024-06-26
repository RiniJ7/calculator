import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      //Edge Case: case allows overwriting over the previous results
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      //Edge Case: avoiding multiple zeroes and multiple decimal points
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      //Edge Case : Takes care when the wrong operator is chosen , switching between the operators
      if (state.currentOperand == null) {
        return { ...state, operation: payload.operation };
      }
      //Edge Case : to handle when an operation is chosen and a number is not
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      //Edge Case : to handle when there is no previous number typed, but a new number is typed in
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      //Default action
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite){
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        } 
        if (state.currentOperand == null) return state
        if(state.currentOperand.length === 1) {
          return {...state, currentOperand: null}
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}
function evaluate({ currentOperand, previousOperand, operation }) {

  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "÷":
      computation = prev / current;
      break;
    case "*":
      computation = prev * current;
      break;
  }
  return computation.toString();
}

//function to format the results
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
<>

    <div class="title-container">
  <h1 class="title">Digital Calculator</h1>
</div>
    <div className="calculator-grid">
       <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand) }

        </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
    </>
  );
}

export default App;
