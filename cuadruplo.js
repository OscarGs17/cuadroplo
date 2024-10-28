function evaluarExpresion(texto) {
    if (!texto || /[^0-9+\-*/\s]/.test(texto)) {
        return 'Entrada inválida: Solo se permiten números y los operadores +, -, *, /';
    }

    let tokens = texto.match(/(\d+|[+\-*/])/g);
    if (!tokens) {
        return 'Entrada inválida';
    }

    let pilaValores = [];
    let pilaOperadores = [];
    let pasosCalculo = '';

    const aplicarOperacion = (operador) => {
        let operando2 = pilaValores.pop();
        let operando1 = pilaValores.pop();

        if (operador === '/' && operando2 === 0) {
            return 'Error: División por cero';
        }

        let resultado;
        switch (operador) {
            case '+':
                resultado = operando1 + operando2;
                pasosCalculo += `${operando1} + ${operando2} = ${resultado}\n`;
                break;
            case '-':
                resultado = operando1 - operando2;
                pasosCalculo += `${operando1} - ${operando2} = ${resultado}\n`;
                break;
            case '*':
                resultado = operando1 * operando2;
                pasosCalculo += `${operando1} * ${operando2} = ${resultado}\n`;
                break;
            case '/':
                resultado = operando1 / operando2;
                pasosCalculo += `${operando1} / ${operando2} = ${resultado}\n`;
                break;
        }
        pilaValores.push(resultado);
    };

    const precedencia = (operador) => {
        return operador === '+' || operador === '-' ? 1 : 2;
    };

    // Procesa los tokens de entrada
    for (let token of tokens) {
        if (!isNaN(token)) {
            pilaValores.push(parseFloat(token));
        } else if (['+', '-', '*', '/'].includes(token)) {
            while (pilaOperadores.length && precedencia(token) <= precedencia(pilaOperadores[pilaOperadores.length - 1])) {
                let resultadoOperacion = aplicarOperacion(pilaOperadores.pop());
                if (typeof resultadoOperacion === 'string') {
                    return resultadoOperacion; 
                }
            }
            pilaOperadores.push(token);
        }
    }

    
    while (pilaOperadores.length) {
        let resultadoOperacion = aplicarOperacion(pilaOperadores.pop());
        if (typeof resultadoOperacion === 'string') {
            return resultadoOperacion; 
        }
    }

    if (pilaValores.length === 1) {
        pasosCalculo += `\nResultado final: ${pilaValores[0]}`;
        return pasosCalculo;
    } else {
        return 'Entrada inválida';
    }
}

document.getElementById('guardarTexto').addEventListener('click', function () {
    let textoEntrada = document.getElementById('texto').value.trim();
    
    if (textoEntrada === '') {
        Swal.fire('Error', 'Por favor, ingresa una expresión.', 'error');
        return;
    }

    let resultado = evaluarExpresion(textoEntrada);
    document.getElementById('busqueda').value = resultado;
});

document.getElementById('limpiar').addEventListener('click', function () {
    document.getElementById('texto').value = '';
    document.getElementById('busqueda').value = '';
});
