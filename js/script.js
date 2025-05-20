class Calculator {
   constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
   }

   clear() {
      this.currentOperand = ""
      this.previousOperand = ""
      this.operation = undefined
   }

   delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
   }

   appendNumber(number) {
      if (number === "." && this.currentOperand.includes(".")) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
   }

   chooseOperation(operation) {
      if (this.currentOperand === "") return
      if (this.previousOperand !== "") {
         this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ""
   }

   compute() {
      let computation
      const prev = Number.parseFloat(this.previousOperand)
      const current = Number.parseFloat(this.currentOperand)
      if (isNaN(prev) || isNaN(current)) return

      switch (this.operation) {
         case "+":
            computation = prev + current
            break
         case "-":
            computation = prev - current
            break
         case "×":
            computation = prev * current
            break
         case "÷":
            if (current === 0) {
               this.currentOperand = "Error"
               this.operation = undefined
               this.previousOperand = ""
               return
            }
            computation = prev / current
            break
         default:
            return
      }

      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand = ""
   }

   getDisplayNumber(number) {
      if (number === "Error") return "Error"

      const stringNumber = number.toString()
      const integerDigits = Number.parseFloat(stringNumber.split(".")[0])
      const decimalDigits = stringNumber.split(".")[1]

      let integerDisplay
      integerDisplay = isNaN(integerDigits) ? "" : integerDigits.toLocaleString("en", {
         maximumFractionDigits: 0,
      });

      return decimalDigits != null ? `${integerDisplay}.${decimalDigits}` : integerDisplay;
   }

   updateDisplay() {
      this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
      this.previousOperandTextElement.innerText = this.operation != null ? `${this.getDisplayNumber(this.previousOperand)} ${this.operation}` : "";
   }
}

// Select all the elements we need
const numberButtons = document.querySelectorAll("[data-number]")
const operationButtons = document.querySelectorAll("[data-operation]")
const equalsButton = document.querySelector("[data-equals]")
const deleteButton = document.querySelector("[data-delete]")
const allClearButton = document.querySelector("[data-all-clear]")
const previousOperandTextElement = document.querySelector("[data-previous-operand]")
const currentOperandTextElement = document.querySelector("[data-current-operand]")

// Create the calculator
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

// Add event listeners for number buttons
numberButtons.forEach((button) => {
   button.addEventListener("click", () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
   })
})

// Add event listeners for operation buttons
operationButtons.forEach((button) => {
   button.addEventListener("click", () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
   })
})

// Add event listener for equals button
equalsButton.addEventListener("click", () => {
   calculator.compute()
   calculator.updateDisplay()
})

// Add event listener for all clear button
allClearButton.addEventListener("click", () => {
   calculator.clear()
   calculator.updateDisplay()
})

// Add event listener for delete button
deleteButton.addEventListener("click", () => {
   calculator.delete()
   calculator.updateDisplay()
})

// Add keyboard support
document.addEventListener("keydown", (event) => {
   if (/[0-9]/.test(event.key)) {
      calculator.appendNumber(event.key)
      calculator.updateDisplay()
   } else if (event.key === ".") {
      calculator.appendNumber(event.key)
      calculator.updateDisplay()
   } else if (event.key === "+" || event.key === "-") {
      calculator.chooseOperation(event.key)
      calculator.updateDisplay()
   } else if (event.key === "*") {
      calculator.chooseOperation("×")
      calculator.updateDisplay()
   } else if (event.key === "/") {
      calculator.chooseOperation("÷")
      calculator.updateDisplay()
   } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault()
      calculator.compute()
      calculator.updateDisplay()
   } else if (event.key === "Backspace") {
      calculator.delete()
      calculator.updateDisplay()
   } else if (event.key === "Escape") {
      calculator.clear()
      calculator.updateDisplay()
   }
})
