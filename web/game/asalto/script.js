var _torre;
var _campo;
var _line;
var ficha_lista = false; // True indica que hay una ficha lista para ser movida
var ficha; // Ficha que se va a mover
var ficha_is_comestible = false;
var fichas_comidas = 0;
var nro_t;
var nro_c;
var nro_l;
var turno = 'c';
var player = {
    'tipo': {
        'p1': 'C',
        'p2': 'H'
    },
    'turnoActual': 'C',
    'playerActual': 'p1',
    'permisoPC': true
}
var fichasTorre;
var help_mov = false;

window.addEventListener('load', function() {
    _torre = document.querySelectorAll("#spaces ._torre");
    _campo = document.querySelectorAll("#spaces ._campo");
    _line = document.querySelectorAll("._line");

    document.getElementById('s-p1').
        addEventListener('click', function(){
            change(this);
        });
    document.getElementById('s-p2').
        addEventListener('click', function(){
            change(this);
        });
    document.getElementById('ok').
        addEventListener('click', function(){
            saveChange(this);
        });
    document.getElementById('h_m_option').
        addEventListener('click', function(){
            var node = document.getElementById('help_mov');

            if (this.checked) {
                node.style.color = '#fff';
            } else {
                node.style.color = '#000';
            }
        });

    // Agregando evento para el movimiento de las fichas
    nro_t = _torre.length;
    nro_c = _campo.length;
    nro_l = _line.length;
    
    for (var i = 0; i < nro_t; ++i) {
        (function(index){
            _torre[index].addEventListener('click', function(){
                if (player.turnoActual === 'H') moverFicha(this);
                else if (player.permisoPC === true) moverFicha(this);
                else alert('No es tu turno para mover');
            });
        })(i);
    }

    for (var i = 0; i < nro_c; ++i) {
        (function(index){
            _campo[index].addEventListener('click', function(){
                if (player.turnoActual === 'H') moverFicha(this);
                else if (player.permisoPC === true) moverFicha(this);
                else alert('No es tu turno para mover');
            });
        })(i);
    }    
});

function moverFicha(f)
{
    // Verificando si la acción es realizada por un humano
    //if (player.permisoPC === false) {
        // verificando si existe una ficha lista para mover
        if (ficha_lista === true) {
            // Verificando si se ha hecho click en la misma ficha
            if (f.dataset.ficha === ficha.dataset.ficha) {
                ficha.classList.remove('_ficha_' + ficha.dataset.tipoFicha + '_hover');
                ficha_lista = false;
                borrarEstilosFree();
            } else {
                // Verificando si la casilla no tiene una ficha
                if (f.dataset.ficha == undefined || f.dataset.ficha === '') {
                    // verificando si la casilla está marcada como "disponible para mover"
                    if (f.classList.contains('_free')) {
                        mover(f);
                        ficha_lista = false;

                        if (player.playerActual == 'p1') { console.log('IF == P1');
                            player.turnoActual = player.tipo.p2;
                            player.playerActual = 'p2';
                        } else { console.log('IF == P2');
                            player.turnoActual = player.tipo.p1;
                            player.playerActual = 'p1';
                        }

                        console.log('Player.turnoActual: ' + player.turnoActual);
                        if (player.turnoActual === 'C') initGame();                        
                    } else {
                        alert("Seleccione una celda válida para mover");
                    }
                } else {
                    alert("Seleccione una celda libre para mover");
                }
            }

        } else {
            // Verificando si la casilla tiene una ficha
            if (f.dataset.ficha != undefined && f.dataset.ficha != '') {
                ficha = f;

                // Verificando si es el turno del jugador para mover
                if (ficha.dataset.tipoFicha === turno) {
                    // buscando espacios libres para mover
                    if (searchFreeSpaces()) {
                        ficha_lista = true;
                        ficha.classList.add('_ficha_' + ficha.dataset.tipoFicha + '_hover');
                    } else {
                        ficha_lista = false;
                        alert("La ficha no puede ser movida");
                    }
                } else {
                    alert("No es tu turno para mover.");
                }

            } else {
                alert("La celda no contiene una ficha");
            }
        }
    /*} else {
        alert("El comando está siendo ejecutado por el ordenador...!");
    }*/
}

function searchFreeSpaces()
{
    var nro_mov = 0;

    // verificando el tipo de ficha para indicar campos disponibles para el movimiento
    if (ficha.dataset.tipoFicha === 't') {
        nro_mov += t_freeV();
        nro_mov += t_freeH();
        nro_mov += t_freeD();

        return (nro_mov > 0) ? true : false;
    } else {
        nro_mov += c_freeV();
        nro_mov += c_freeH();
        nro_mov += c_freeD();

        return (nro_mov > 0) ? true : false;
    }
}

function c_freeV()
{
    var nro_mov = 0;

    nro_mov += c_freeVT();
    nro_mov += c_freeVB();

    return nro_mov;
}
function c_freeH()
{
    var nro_mov = 0;

    nro_mov += c_freeHL();
    nro_mov += c_freeHR();

    return nro_mov;
}
function c_freeD()
{
    var nro_mov = 0;

    nro_mov += c_freeDLT();
    nro_mov += c_freeDLB();
    nro_mov += c_freeDRT();
    nro_mov += c_freeDRB();

    return nro_mov;
}

function c_freeVT()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f - 1;
    var new_c = c;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            pintarLinea(ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return (bool === true) ? nro_mov + 1 : nro_mov;
}
function c_freeVB()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = parseInt(f) + 1;
    var new_c = c;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            pintarLinea(ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return (bool === true) ? nro_mov + 1 : nro_mov;
}

function c_freeHL()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f;
    var new_c = c - 1;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            pintarLinea(ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return (bool === true) ? nro_mov + 1 : nro_mov;
}
function c_freeHR()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f;
    var new_c = parseInt(c) + 1;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            pintarLinea(ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return (bool === true) ? nro_mov + 1 : nro_mov;
}

function c_freeDLT()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = parseInt(f) + 1;
    var new_c = parseInt(c) - 1;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (ficha.dataset.celda != '23' && ficha.dataset.celda != '56') {
        if (bool) {
            bool = verificarDisponibilidad(new_coord);

            // Pintando la celda disponible
            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        return (bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function c_freeDLB()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = parseInt(f) - 1;
    var new_c = parseInt(c) - 1;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (ficha.dataset.celda != '36' && ficha.dataset.celda != '63') {
        if (bool) {
            bool = verificarDisponibilidad(new_coord);

            // Pintando la celda disponible
            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        return (bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function c_freeDRT()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = parseInt(f) - 1;
    var new_c = parseInt(c) + 1;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (ficha.dataset.celda != '32' && ficha.dataset.celda != '65') {
        if (bool) {
            bool = verificarDisponibilidad(new_coord);

            // Pintando la celda disponible
            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        return (bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function c_freeDRB()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = parseInt(f) + 1;
    var new_c = parseInt(c) + 1;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada(new_coord);

    if (ficha.dataset.celda != '25' && ficha.dataset.celda != '52') {
        if (bool) {
            bool = verificarDisponibilidad(new_coord);

            // Pintando la celda disponible
            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        return (bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}


function t_freeV()
{
    var nro_mov = 0;

    nro_mov += t_freeVT();
    nro_mov += t_freeVB();

    return nro_mov;
}
function t_freeH()
{
    var nro_mov = 0;

    nro_mov += t_freeHL();
    nro_mov += t_freeHR();

    return nro_mov;
}
function t_freeD()
{
    var nro_mov = 0;

    nro_mov += t_freeDLT();
    nro_mov += t_freeDLB();
    nro_mov += t_freeDRT();
    nro_mov += t_freeDRB();

    return nro_mov;
}

function t_freeVT()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    //if (f < 3) {
        var new_f = parseInt(f) - 1;
        var new_c = c;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);
            if (f_bool) {
                // Verificando si la ficha puede ser comida
                if (new_f >= 2) {
                    var coord_necesaria = (new_f - 1) + '' + new_c;
                    if (fichaComestible(coord_necesaria)) {
                        pintarLinea(ficha.dataset.celda, new_coord);
                        pintarLinea(new_coord, coord_necesaria);
                        pintarCelda(coord_necesaria);
                        setComestible(coord_necesaria, new_coord);
                    } else {
                        f_bool = false;
                    }
                } else {
                    f_bool = false;
                }
            }
        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    /*} else {
        return nro_mov;
    }*/
}
function t_freeVB()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (f < 3) {
        var new_f = parseInt(f) + 1;
        var new_c = c;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        // Verificando si existe ficha disponible para comer
        f_bool = verificarFichaParaComer(new_coord);

        if (f_bool) {
            // Verificando si la ficha puede ser comida
            if (new_f <= 2) {
                var coord_necesaria = (new_f + 1) + '' + new_c;

                if (fichaComestible(coord_necesaria)) {
                    pintarLinea(ficha.dataset.celda, new_coord);
                    pintarLinea(new_coord, coord_necesaria);
                    pintarCelda(coord_necesaria);
                    setComestible(coord_necesaria, new_coord);
                } else {
                    f_bool = false;
                }
            } else {
                f_bool = false;
            }
        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}

function t_freeHL()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (c > 3) {
        var new_f = parseInt(f);
        var new_c = parseInt(c) - 1;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);

            if (f_bool) {
                // Verificando si la ficha puede ser comida
                if (new_c >= 4) {
                    var coord_necesaria = new_f + '' + (new_c - 1);
                    if (fichaComestible(coord_necesaria)) {
                        pintarLinea(ficha.dataset.celda, new_coord);
                        pintarLinea(new_coord, coord_necesaria);
                        pintarCelda(coord_necesaria);
                        setComestible(coord_necesaria, new_coord);
                    } else {
                        f_bool = false;
                    }
                } else {
                    f_bool = false;
                }
            }
        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function t_freeHR()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (c < 5) {
        var new_f = parseInt(f);
        var new_c = parseInt(c) + 1;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);

            if (f_bool) {
                // Verificando si la ficha puede ser comida
                if (new_c <= 4) {
                    var coord_necesaria = new_f + '' + (new_c + 1);
                    if (fichaComestible(coord_necesaria)) {
                        pintarLinea(ficha.dataset.celda, new_coord);
                        pintarLinea(new_coord, coord_necesaria);
                        pintarCelda(coord_necesaria);
                        setComestible(coord_necesaria, new_coord);
                    } else {
                        f_bool = false;
                    }
                } else {
                    f_bool = false;
                }
            }
        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}

function t_freeDLT()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (f > 1) {
        var new_f = parseInt(f) - 1;
        var new_c = parseInt(c) - 1;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);

            if (f_bool) {
                // Verificando si la ficha puede ser comida
                if (new_c >= 4) {
                    var coord_necesaria = (new_f - 1) + '' + (new_c - 1);
                    if (fichaComestible(coord_necesaria)) {
                        pintarLinea(ficha.dataset.celda, new_coord);
                        pintarLinea(new_coord, coord_necesaria);
                        pintarCelda(coord_necesaria);
                        setComestible(coord_necesaria, new_coord);
                    } else {
                        f_bool = false;
                    }
                } else {
                    f_bool = false;
                }
            }
        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function t_freeDLB()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (f < 3 && c > 3) {
        var new_f = parseInt(f) + 1;
        var new_c = parseInt(c) - 1;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);

            if (f < 2) {
                if (f_bool) {
                    // Verificando si la ficha puede ser comida
                    if (new_c >= 4) {
                        var coord_necesaria = (new_f + 1) + '' + (new_c - 1);
                        if (fichaComestible(coord_necesaria)) {
                            pintarLinea(ficha.dataset.celda, new_coord);
                            pintarLinea(new_coord, coord_necesaria);
                            pintarCelda(coord_necesaria);
                            setComestible(coord_necesaria, new_coord);
                        } else {
                            f_bool = false;
                        }
                    } else {
                        f_bool = false;
                    }
                }
            }

        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function t_freeDRT()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (f > 1) {
        var new_f = parseInt(f) - 1;
        var new_c = parseInt(c) + 1;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);

            if (f_bool) {
                // Verificando si la ficha puede ser comida
                if (new_c <= 4) {
                    var coord_necesaria = (new_f - 1) + '' + (new_c + 1);
                    if (fichaComestible(coord_necesaria)) {
                        pintarLinea(ficha.dataset.celda, new_coord);
                        pintarLinea(new_coord, coord_necesaria);
                        pintarCelda(coord_necesaria);
                        setComestible(coord_necesaria, new_coord);
                    } else {
                        f_bool = false;
                    }
                } else {
                    f_bool = false;
                }
            }
        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}
function t_freeDRB()
{
    var nro_mov = 0;
    var coordenadas = getCoordenadas(ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var bool;
    var f_bool;

    if (f < 3 && c < 5) {
        var new_f = parseInt(f) + 1;
        var new_c = parseInt(c) + 1;
        var new_coord = new_f + '' + new_c;
        bool = verificarCoordenada(new_coord);

        if (bool) {
            // Pintando la celda disponible
            bool = verificarDisponibilidad(new_coord);

            if (bool) {
                pintarLinea(ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }

        if (verificarCoordenada(new_coord)) {
            // Verificando si existe ficha disponible para comer
            f_bool = verificarFichaParaComer(new_coord);

            if (f < 2) {
                if (f_bool) {
                    // Verificando si la ficha puede ser comida
                    if (new_c <= 4) {
                        var coord_necesaria = (new_f + 1) + '' + (new_c + 1);
                        if (fichaComestible(coord_necesaria)) {
                            pintarLinea(ficha.dataset.celda, new_coord);
                            pintarLinea(new_coord, coord_necesaria);
                            pintarCelda(coord_necesaria);
                            setComestible(coord_necesaria, new_coord);
                        } else {
                            f_bool = false;
                        }
                    } else {
                        f_bool = false;
                    }
                }
            }

        }

        return (bool === true || f_bool === true) ? nro_mov + 1 : nro_mov;
    } else {
        return nro_mov;
    }
}


function mover(f)
{
    var clase_f = '_ficha_' + ficha.dataset.tipoFicha;
    var clase_h = '_ficha_' + ficha.dataset.tipoFicha + '_hover';

    // Pasando metadatos
    f.dataset.ficha = ficha.dataset.ficha;
    f.dataset.tipoFicha = ficha.dataset.tipoFicha;
    ficha.dataset.ficha = '';
    ficha.dataset.tipoFicha = '';

    // Actualizando estilos;
    ficha.classList.remove(clase_f);
    ficha.classList.remove(clase_h);
    f.classList.add(clase_f);

    if (f.dataset.comer != undefined && f.dataset.comer !== '') {
        var f_a_comer = document.getElementById(f.dataset.comer);

        f_a_comer.dataset.ficha = '';
        f_a_comer.dataset.tipoFicha = '';
        f_a_comer.classList.remove('_ficha_c');
        f.dataset.comer = '';

        fichas_comidas++;
        document.getElementById("fc_nro").textContent = fichas_comidas;
    }

    cambiarTurno();
    borrarEstilosFree();
    verificarEstadoJuego();
}



/**
 * HELPERS
 */
function getCoordenadas(item)
{
    var x, y;

    x = item.dataset.celda.substring(0, 1);
    y = item.dataset.celda.substring(1);

    return [x, y];
}
// Verifica si la coordenada pasada como argumento existe en el tablero del juego
function verificarCoordenada_fc(coord)
{
    for (var i = 0; i < nro_t; ++i) {
        if (_torre[i].dataset.celda == coord) {
            return true;
        }
    }
    for (var i = 0; i < nro_c; ++i) {
        if (_campo[i].dataset.celda == coord) {
            return true;
        }
    }

    return false;
}

// Verifica si la coordenada pasada como argumento existe en el tablero del juego
// y si es permitido mover la ficha de su posición actual a la nueva
function verificarCoordenada(coord)
{
    var new_coord = ficha.dataset.celda;
    var coordA = coord + '-' + new_coord;
    var coordB = new_coord + '-' + coord;
    var bool = (document.getElementById(coordA) || document.getElementById(coordB));

    for (var i = 0; i < nro_t; ++i) {
        if (_torre[i].dataset.celda == coord && bool) {
            return true;
        }
    }
    for (var i = 0; i < nro_c; ++i) {
        if (_campo[i].dataset.celda == coord && bool) {
            return true;
        }
    }

    return false;
}
// Verifica si la casilla ubidaca en la coordena no está ocupada por otra ficha
function verificarDisponibilidad(coord)
{
    var item = document.getElementById(coord);
    var bool = false;

    if (item.dataset.ficha == undefined || item.dataset.ficha === '') {
        bool = true;
    }

    return bool;
}
// Verifica si existe una ficha para ser comida
function verificarFichaParaComer(coord)
{
    var item = document.getElementById(coord);
    var bool = false;

    if (item.dataset.tipoFicha == 'c') {
        bool = true;
    }

    return bool;
}
// Verifica si una ficha puede ser comida
function fichaComestible(coord)
{
    ficha_is_comestible = true;

    if (verificarCoordenada_fc(coord)) {
        var item = document.getElementById(coord);
        var bool = false;

        if (item.dataset.ficha == undefined || item.dataset.ficha === '') {
            bool = true;
        }
        
        ficha_is_comestible = false;
        return bool;
    } else {
        ficha_is_comestible = false;
        return false;
    }
}
function pintarCelda(coord)
{
    var item = document.getElementById(coord);
    var clase = '';
    var celda = parseInt(item.dataset.celda);
    item.classList.add('_free');
    
    if (!help_mov) {
        clase = '_disabled_' + (((celda >= 31 && celda <= 32)  || celda >= 36) ? 'c' : 't') + '_free';
        item.classList.add(clase);
    }
}
function pintarLinea(coord, new_coord)
{
    var coordA = coord + '-' + new_coord;
    var coordB = new_coord + '-' + coord;

    if (document.getElementById(coordA)) {
        document.getElementById(coordA).classList.add('_line_free');
    } else if (document.getElementById(coordB)) {
        document.getElementById(coordB).classList.add('_line_free');
    }
    
    if (!help_mov) {
        if (document.getElementById(coordA)) {
            document.getElementById(coordA).classList.add('_disabled_line_free');
        } else if (document.getElementById(coordB)) {
            document.getElementById(coordB).classList.add('_disabled_line_free');
        }
    }
}
// Asigna el metadato que indica la ficha a ser comida
function setComestible(coord, ficha_a_comer)
{
    var item = document.getElementById(coord);
    item.dataset.comer = ficha_a_comer;
}
// quita la clase _free de todas las fichas
function borrarEstilosFree()
{
    for (var i = 0; i < nro_t; ++i) {
        _torre[i].classList.remove('_free');
        _torre[i].classList.remove('_disabled_t_free');
        _torre[i].classList.remove('_disabled_c_free');
        _torre[i].dataset.comer = '';
    }
    for (var i = 0; i < nro_c; ++i) {
        _campo[i].classList.remove('_free');
        _campo[i].classList.remove('_disabled_t_free');
        _campo[i].classList.remove('_disabled_c_free');
        _campo[i].dataset.comer = '';
    }
    for (var i = 0; i < nro_l; ++i) {
        _line[i].classList.remove('_line_free');
        _line[i].classList.remove('_disabled_line_free');
    }   
}

function cambiarTurno()
{
    var t = document.getElementById("t_img");

    if (turno === 't') {
        turno = 'c';
        t.classList.remove('_ficha_t');
        t.classList.add('_ficha_c');
    } else {
        turno = 't';
        t.classList.remove('_ficha_c');
        t.classList.add('_ficha_t');
    }
}
// Verifica si se han cumplido las condiciones para terminar el juego con un ganador
function verificarEstadoJuego()
{
    // Si está lleno
    if (verificarTorreLlena()) {
        alert('¡Juego terminado!, ganó el atacante.');
        location.href = location.href;
    }
    // Si quedan 8 fichas
    else if (verificarNroFichas()) {
        alert('¡Juego terminado!, ganó la torre.');
        location.href = location.href;
    }
    // Si las fichas amarillas (fichas de la torre) no pueden ser movidas
    else if (!verificarFichasTorreSePuedenMover()){
        alert('!Juego terminado!, ganó el atacante.');
        location.href = location.href;
    }
}
function verificarTorreLlena()
{
    var nro_casillas_ocupadas = 0;

    for (var i = 0; i < nro_t; i++) {
        if (_torre[i].dataset.ficha != undefined && _torre[i].dataset.ficha != '') {
            nro_casillas_ocupadas++;
        }
    }

    return (nro_casillas_ocupadas >= 9) ? true : false;
}
function verificarNroFichas()
{
    var nro_fichas = 0;

    for (var i = 0; i < nro_t; i++) {
        if (_torre[i].dataset.tipoFicha === 'c') {
            nro_fichas++;
        }
    }

    for (var i = 0; i < nro_c; i++) {
        if (_campo[i].dataset.tipoFicha === 'c') {
            nro_fichas++;
        }
    }

    return (nro_fichas <= 8) ? true : false;
}
function verificarFichasTorreSePuedenMover()
{
    var nroMovimientos = 0;
    fichasTorre = document.querySelectorAll('#spaces ._ficha_t');

    for (var i = 0; i < 2; ++i) {
        nroMovimientos += verFreeMovFichaTorre(i+1, fichasTorre[0]);
        nroMovimientos += verFreeMovFichaTorre(i+1, fichasTorre[1]);
    }

    return (nroMovimientos > 0) ? true : false;
}


function change(node)
{
    var n = document.getElementById(node.dataset.p);
    var aux = node.textContent;

    node.textContent = n.textContent;
    n.textContent = aux;
}
function saveChange()
{
    player.tipo.p1 = document.getElementById('s_p1').textContent;
    player.tipo.p2 = document.getElementById('s_p2').textContent;

    // Asignando el primer turno
    if (player.tipo.p1 === 'H') {
        player.turnoActual = 'H';
    } else {
        player.turnoActual = 'C';
    }

    if (document.getElementById('h_m_option').checked) help_mov = true;
    
    document.getElementById('options').remove();
    initGame();
}
function bloquearPantalla(bool)
{
    if (bool) document.getElementById('screenBlock').style.display = 'block';
    else document.getElementById('screenBlock').style.display = 'none';
}

/* Artificial intelligence */
function initGame()
{
    console.log("En initGame");
    // Verificando si el PC jugará
    if (player.turnoActual === 'C') {
        player.permisoPC = true;
        bloquearPantalla(true);
        console.log('Permiso PC: ' + player.permisoPC);
        // Verificando el tipo de ficha que el PC moverá
        if (turno === 't') { // Moverá las fichas de la torre
            console.log('PC moverá: t')
            getFichas('t');
            getFichasMovibles();
        } else { // Moverá las fichas atacantes
            console.log('PC moverá: c')

            var fichas = getFichas('c');
            var fichas_mov = getFichasMovibles(1, fichas);
            var len_f_m = fichas_mov.length;
            var result;
            var fichas_con_mov_dis = new Array();
            var ficha_a_mover = new Array();
            var fichas_atacantes_en_torre = new Array();

            // Verificando si la ficha puede ser comida al moverse
            for (var i = 0; i < len_f_m; ++i) {
                for (index in fichas_mov[i]) { console.log('Verificando si la ficha puede ser comida: ' +  fichas_mov[i][index]);
                    result = isComestible(fichas_mov[i][index]);      console.log('El resultado: ' + result);
                    if (!result) {
                        fichas_mov[i][index][3] = 'noComestible';
                    } else {
                        fichas_mov[i][index][3] = 'comestible';
                    }
                } // End for in
            }

            // Obteniendo la ficha con todos sus movimientos disponibles (en las que puede ser comida o no)
            fichas_con_mov_dis = getFichasConMovDis(fichas_mov);           console.log('Mostrando todas las fichas que pueden ser movidas:');console.log(fichas_con_mov_dis);console.log('----------------------------------------------------');

            // Obteniendo fichas atacantes ubicadas en la torre
            console.log('Obteniendo fichas atacantes ubicadas en la torre');
            fichas_atacantes_en_torre = getFichasAtacantesEnTorre(fichas_con_mov_dis);   console.log(fichas_atacantes_en_torre); console.log('-----------------------------------------------------------');

            // Si existen fichas atacantes en torre a mover
            if (fichas_atacantes_en_torre[0]) { console.log('Obteniendo fichas atacantes en torre almenos con un movimiento sin peligro (en caso contrario devuelve las fichas con movimientos peligrosos)');
                // Obteniendo todas la fichas que tienen almenos un movimiento sin peligro, se actualiza el valor booleano a 2 si no se encontraron fichas con
                // movimentos libres sin peligro
                fichas_atacantes_en_torre = getFichasAETConMovFree(fichas_atacantes_en_torre); console.log(fichas_atacantes_en_torre);console.log('-------------------------------------------------------------');
            }

            // Si existen fichas atacantes en torre con movimientos libres
            if (fichas_atacantes_en_torre[0] === true || fichas_atacantes_en_torre[0] === 2) {
                // Verificando si existen una o más fichas, que corren el riesgo de ser comidas en el siguiente turno
                var fichas_con_riesgo = new Array();
                var fichas_con_riesgo_movibles = new Array(); // Fichas que en el próximo movimiento serán comidas pero pueden evitarlo
                fichas_con_riesgo = getFichasConRiesgoASerComidas(fichas_atacantes_en_torre[1]);
                fichas_con_riesgo_movibles = getFichasConRiesgoMovibles(fichas_con_riesgo);

                console.log('FIchas con riesgo que se pueden salvar'); console.log(fichas_con_riesgo_movibles);
                if (fichas_con_riesgo_movibles.length > 0) {
                    ficha_a_mover = decidirFichaAMover(fichas_con_riesgo_movibles);
                    ficha_a_mover = deleteMovW(ficha_a_mover); // Eliminando los movimientos peligrosos
                    console.log('deleteMovW');
                    console.log(ficha_a_mover);
                    iniciarMovimiento(ficha_a_mover);
                    console.log('¡En hora buena! ¡Lo has logrado :D!');
                } else { // TODO: se puede mejorar dando prioridad a las fichas que no corren riesgo de ser comidas en moverse hasta el final para llenar la torre y ganar el juego
                    // Decidiendo si vale la pena mover alguna ficha atacante ubicada en el espacio de la torre
                    // Obteniendo las fichas que tienen un movimiento seguro
                    /*if (true) {
                        ficha_a_mover = decidirFichaAMover(fichas_atacantes_en_torre[1]);
                        iniciarMovimiento(ficha_a_mover);
                    } else {*/
                        ficha_a_mover = decidirFichaAMover(fichas_con_mov_dis);
                        iniciarMovimiento(ficha_a_mover);
                    //}
                }
            } else {console.log('decidirFichaAMover'); console.log(fichas_con_mov_dis);
                ficha_a_mover = decidirFichaAMover(fichas_con_mov_dis); console.log('Este es el primer movimiento.');console.log(ficha_a_mover);
                iniciarMovimiento(ficha_a_mover);
            }
        }

        player.permisoPC = false;
        bloquearPantalla(false);
    } else {
        player.turnoActual = 'H';
        player.permisoPC = false;
    }
}
/**
 * Elimina los movimientos en los cuales la ficha puede ser comida
 * @param  {[Array]} f
 * @return {[Array]}
 */
function deleteMovW(f)
{
    var movimientos = f[1],
        desc_mov,
        mov_aceptables = new Array();

    for (index in movimientos) {
        desc_mov = movimientos[index][1];

        if (desc_mov == 'noComestible') {
            mov_aceptables.push(movimientos[index]);
        }
    }

    f[1] = mov_aceptables;

    return f;
}
/**
 * Obtiene las fichas atacantes en torre que pueden evitar ser comidas en el siguiente movimiento.
 * @param  {[Array]} fichas_con_riesgo
 * @return {[Array]}
 *         [0] Fichas obtenidas
 */
function getFichasConRiesgoMovibles(fichas_con_riesgo)
{
    var f = new Array();
    var ficha,
        movimientos,
        movimiento;

    for (index in fichas_con_riesgo) {
        ficha = fichas_con_riesgo[index];
        movimientos = ficha[1];

        for (indice in movimientos) {
            movimiento = movimientos[indice];

            if (movimiento[1] == 'noComestible') { console.log('_______________________------------------------------__________________________');
                f.push(ficha);
                break;
            }
        }
    }

    return f;
}
/**
 * Obtiene las fichas atacantes en torre que pueden ser comidas en el siguiente movimiento.
 * @param  {[Array]} fichas
 * @return {[Array]}
 *         [0] Boolean
 *         [1] Fichas con riesgo a ser comidas
 */
function getFichasConRiesgoASerComidas(fichas)
{
    var ficha;
    var bool; // Idica si se enconotró alemnos una ficha con riesgo de ser comida
    var f = new Array(
        false,
        new Array()
    ); // Fichas con riesgo a ser comidas
    var f_c_r = new Array(); // Fichas en celdas de riesgo
    
    f_c_r = getFichasEnCeldasDeRiesgo(fichas);

    return f_c_r;
}
/**
 * Obtiene las fichas atacantes en torre que están ubicadas en las celdas de riesgo (celdas que permiten a las fichas ser comidas).
 * @param  {[Array]} fichas
 * @return {[Array]}
 */
function getFichasEnCeldasDeRiesgo(fichas)
{
    var f = new Array();
    var celda; // Celda en la que está ubicada la ficha
    var celdas = ['13', '23', '24', '25', '34']; // Celdas en las que se corre el riesgo de ser comido

    for (index in fichas) {
        ficha = fichas[index];
        celda = ficha[0];

        for (indice in celdas) {
            if (celda == celdas[indice]) {
                f.push(ficha);
                break;
            }
        }
    }

    return f;
}
/**
 * Obtiene las fichas atacantes en torre que almenos tienen un movimiento disponible, libre de peligro.
 * @param  {[Array]} fichas_atacantes_en_torre
 * @return {[Array]}
 */
function getFichasAETConMovFree(fichas_atacantes_en_torre)
{
    var aux_f_a_en_torre = new Array(
        2,
        new Array()
    );
    var fichas = fichas_atacantes_en_torre[1];
    var ficha,
        movimientos,
        movimiento;
    var mov_sin_peligro = false;

    for (index in fichas) {
        mov_sin_peligro = false;
        ficha = fichas[index];
        movimientos = ficha[1];

        for (indice in movimientos) {
            movimiento = movimientos[indice];
            
            if (movimiento[1] == 'noComestible' && (parseInt(ficha[0].substring(0, 1)) > 1)) {
                mov_sin_peligro = true;
            }
        }

        if (mov_sin_peligro) {
            aux_f_a_en_torre[0] = true;
            aux_f_a_en_torre[1].push(ficha);
        }
    }

    if (aux_f_a_en_torre[0] === 2) {
        aux_f_a_en_torre[1] = fichas;
    }

    return aux_f_a_en_torre;
}
/**
 * Obtiene las fichas atacantes en la torre
 * @param {Array} fichas Arreglo de las fichas con al menos un movimiento disponible.
 * @return Array: contiene un valor booleano que indica si se encontraron fichas atacantes en torre y un arreglo
 *                de las fichas atactanes encontradas.
 *                [0] boolean
 *                [1] Array
 */
function getFichasAtacantesEnTorre(fichas)
{
    var f, // fila
        c; // columna
    var len_fichas = fichas.length;
    var fichas_en_torre = new Array(
            false,
            new Array()
        );
    var ficha;

    for (var i = 0; i < len_fichas; ++i) {
        ficha = fichas[i];
        f = parseInt(ficha[0].substring(0, 1));
        c = parseInt(ficha[0].substring(1));
        
        if (f <= 3 && (c >= 3 && c <= 5)) {
            fichas_en_torre[0] = true;
            fichas_en_torre[1].push(ficha);
        }
    }

    return fichas_en_torre;
}
function iniciarMovimiento(ficha_a_mover)
{
    console.log('f:iniciarMovimiento');
    console.log('ficha_a_mover');
    console.log(ficha_a_mover);
    var ficha, celda;
    var movimientos_seguros = getMovimientosSeguros(ficha_a_mover[1]);

    if (movimientos_seguros.length > 0) {
        var movimiento_seguro = getMovimiento(movimientos_seguros);

        ficha = document.getElementById(ficha_a_mover[0]);
        celda = document.getElementById(movimiento_seguro[0]);
    } else {
        var movimientos_no_seguros = getMovimientosNoSeguros(ficha_a_mover[1]);
        var movimiento_no_seguro = getMovimiento(movimientos_no_seguros);

        ficha = document.getElementById(ficha_a_mover[0]);
        celda = document.getElementById(movimiento_no_seguro[0]);
    }

    ficha.click();
    celda.click();
}
function decidirFichaAMover(fichas_con_mov_dis)
{
    var fichas_seguras; // Fichas tienen la posibilidad de moverse sin ser comidas
    var ficha_a_mover = new Array();
    var indice_f_a_m;

    // Obteniendo fichas con almenos 1 movimiento en la cual no pueda ser comida
    fichas_seguras = getFichasSeguras(fichas_con_mov_dis);

    // Escogiendo ficha a mover
    if (fichas_seguras.length > 0) {
        indice_f_a_m = getNroAleatorio(fichas_seguras.length);
        ficha_a_mover = fichas_seguras[indice_f_a_m];
    } else {
        indice_f_a_m = getNroAleatorio(fichas_con_mov_dis.length);
        ficha_a_mover = fichas_con_mov_dis[indice_f_a_m];
    }

    return ficha_a_mover;
}
function getMovimiento(movimientos)
{
    var i = getNroAleatorio(movimientos.length);
    return movimientos[i];
}
function getMovimientosSeguros(movimientos)
{
    var movimientos_seguros = new Array();

    for (n in movimientos) {
        movimiento = movimientos[n];

        if (movimiento[1] == 'noComestible') {
            if (!movimientoExiste(movimiento[0], movimientos_seguros)) {
                movimientos_seguros.push(movimiento);
            }
        }
    }


    return movimientos_seguros;
}
function getMovimientosNoSeguros(movimientos)
{
    var movimientos_no_seguros = new Array();

    for (n in movimientos) {
        movimiento = movimientos[n];

        if (movimiento[1] == 'comestible') {
            if (!movimientoExiste(movimiento[0], movimientos_no_seguros)) {
                movimientos_no_seguros.push(movimiento);
            }
        }
    }


    return movimientos_no_seguros;
}
function getFichasSeguras(fichas_con_mov_dis)
{
    var fichas_seguras = new Array();
    var len = fichas_con_mov_dis.length;
    var f, movs_f, mov_f;

    for (var i = 0; i < len; ++i) {
        f = fichas_con_mov_dis[i];
        movs_f = f[1];

        // Recorriendo los movimientos de la ficha
        for (index_mov in movs_f) {
            mov_f = movs_f[index_mov];

            // Verificando si la ficha no es comestible
            if (mov_f[1] == 'noComestible') {
                // verificando si la ficha no ha sido agregada
                if (!fichaSeguraExiste(f, fichas_seguras)) {
                    fichas_seguras.push(f);
                }
            }
        }
    }

    return fichas_seguras;
}
function movimientoExiste(movimiento, movimientos)
{
    var len = movimientos.length;
    var mov;
    var bool = false;

    if (len > 0) {
        for (var i = 0; i < len; i++) {
            mov = movimientos[i];

            if (mov[0] == movimiento) {
                bool = true;
                break;
            }
        }
    }

    return bool;
}
function fichaSeguraExiste(f, fichas_seguras)
{
    var len = fichas_seguras.length;
    var fs;
    var bool = false;

    if (len > 0) {
        for (var i = 0; i < len; i++) {
            fs = fichas_seguras[i];

            if (fs[0] == f[0]) {
                bool = true;
                break;
            }
        }
    }

    return bool;
}
function getNroAleatorio(n)
{
    return Math.floor(Math.random() * n);   
}

function getFichas(tipoFicha)
{
    return document.querySelectorAll('#spaces ._ficha_' + tipoFicha);
}
function getFichasMovibles(nivel, fichas) // para verificar si la ficha se puede mover en todas las direcciones (para las fichas atacantes).
{
    var len = fichas.length;
    var fichas_mov = new Array(
            new Array(), // VT (index: 0)
            new Array(), // DLT (index: 1)
            new Array(), // DRT (index: 2)
            new Array(), // DRB (index: 3)
            new Array(), // DLB (index: 4)
            new Array(), // HL (index: 5)
            new Array() // HR (index: 6)
        );

    for (var i = 0; i < len; ++i) {
        // Si no está en zona segura de torre
        //if (fichas[i].dataset.celda != '13' && fichas[i].dataset.celda != '15') {
            var data = isFreeVT(nivel, fichas[i]);
            if (data[0]) {
                fichas_mov[0][i] = data[1];
            }

            if (parseInt(fichas[i].dataset.celda.substring(1)) >= 4) {
                if (parseInt(fichas[i].dataset.celda.substring(0, 1)) <= 4) {
                    data = isFreeDLT(nivel, fichas[i]);
                    if (data[0]) {
                        fichas_mov[1][i] = data[1];
                    }

                    data = isFreeHL(nivel, fichas[i]);
                    if (data[0]) {
                        fichas_mov[5][i] = data[1];
                    }
                }
            }

            if (parseInt(fichas[i].dataset.celda.substring(1)) <= 4) {
                if (parseInt(fichas[i].dataset.celda.substring(0, 1)) <= 4) {
                    data = isFreeDRT(nivel, fichas[i]);
                    if (data[0]) {
                        fichas_mov[2][i] = data[1];
                    }

                    data = isFreeHR(nivel, fichas[i]);
                    if (data[0]) {
                        fichas_mov[6][i] = data[1];
                    }
                } 
            }
        //}
    }

    return fichas_mov;
}
function getFichasConMovDis(fichas_mov)
{
    var fichas_con_mov_dis = new Array();
    var fichas = new Array();
    var f;
    var len = fichas_mov.length;
    var aux, movs_disponibles;

    // Obteniendo todas las fichas (eliminando fichas repetidas)
    for (var i = 0; i < len; ++i) {
        aux = fichas_mov[i]
        for (n in aux) {
            f = aux[n][1];

            if (!existeFicha(fichas, f)) {
                fichas.push(f);
            }
        }    
    }

    // Asignando los movimientos disponibles a cada ficha
    for (n in fichas) {
        aux = fichas[n];
        
        // Obteniendo todos los movimientos disponibles para la ficha
        movs_disponibles = getMovsDisponibles(aux, fichas_mov);
        fichas_con_mov_dis.push([
            aux,
            movs_disponibles
        ]);
    }

    return fichas_con_mov_dis;
}
function existeFicha(fichas, f)
{
    var bool = false;
    var len = fichas.length;

    if (len > 0) {
        for (var i = 0; i < len; ++i) {
            if (fichas[i] == f) {
                bool = true;
                break;
            }
        }
    }

    return bool;
}
function getMovsDisponibles(f, fichas_mov)
{
    var movs_disponibles = new Array();
    var len = fichas_mov.length;
    var aux;

    for (var i = 0; i < len; ++i) {
        aux = fichas_mov[i];

        for (n in aux) {
            if (f == aux[n][1]) {
                movs_disponibles.push([
                    aux[n][2],
                    aux[n][3]
                ]);
            }
        }
    }

    return movs_disponibles;
}
// Verifica si una ficha puede ser comida
function isComestible(f)
{
    var nroVecesComestible = 0;
    var coordenadas = getCoordenadas(document.getElementById(f[2]));
    var fila = coordenadas[0],
        columna = coordenadas[1];
    var c, t, z, coords = ['VT', 'VB', 'HL', 'HR', 'DLT', 'DLB', 'DRT', 'DRB'],
        coordA, coordB, coord_inversa, cell1, cell2;

    // Si está en una fila libre de peligro    
    if (fila >= 3) {
        nroVecesComestible = -1;
    } else {
        c = f[2];

        for (var i = 0; i < 8; ++i) {
                t = getNewCoord(coords[i], c);

                if (document.getElementById(t)) {
                    // Si existe camino por el cual moverse
                    coordA = c + '-' + t;
                    coordB = t + '-' + c;

                    if (document.getElementById(coordA) || document.getElementById(coordB)) {
                        // Obteniendo celda trasera (celda inversa que también podría contener una ficha tipo torre)
                        coord_inversa = getCoordinversa(coords[i]);
                        z = getNewCoord(coord_inversa, c);
                        coordA = c + '-' + z;
                        coordB = z + '-' + c;

                        if (document.getElementById(coordA) || document.getElementById(coordB)) {
                            cell1 = document.getElementById(t);
                            cell2 = document.getElementById(z);

                            if ((cell1.dataset.celda != f[1] && cell2.dataset.celda != f[1])) {
                                if ((cell1.dataset.tipoFicha == 't' || cell2.dataset.tipoFicha == 't') &&
                                    (cell1.dataset.tipoFicha == '' || cell2.dataset.tipoFicha == '')
                                ) {
                                    nroVecesComestible++;
                                }
                            } else {
                                if (cell1.dataset.tipoFicha == 'c') {
                                    if (cell2.dataset.tipoFicha == 't') {
                                        nroVecesComestible++;
                                    }
                                } else {
                                    if (cell1.dataset.tipoFicha == 't') {
                                        nroVecesComestible++;
                                    }
                                }
                            }
                        }

                    } // Fin if
                } // Fin if
        } // Fin for

    }

    return (nroVecesComestible > 0) ? true : false;
}
function getCoordinversa(coord)
{
    var coord_inversa = '';

    switch (coord) {
        case 'VT': coord_inversa = 'VB';
            break;
        case 'VB': coord_inversa = 'VT';
            break;
        case 'HL': coord_inversa = 'HR';
            break;
        case 'HR': coord_inversa = 'HL';
            break;
        case 'DLT': coord_inversa = 'DRB';
            break;
        case 'DLB': coord_inversa = 'DRT';
            break;
        case 'DRT': coord_inversa = 'DLB';
            break;
        case 'DRB': coord_inversa = 'DLT';
            break;
    }

    return coord_inversa;
}
function getNewCoord(tip_mov, celda)
{
    var new_coord = '';
    var coordenadas = getCoordenadas(document.getElementById(celda));
    var fila = coordenadas[0],
        columna = coordenadas[1];

    switch (tip_mov) {
        case 'VT':
            new_coord = (parseInt(fila) - 1).toString() + '' + columna.toString();
            break;
        case 'VB':
            new_coord = (parseInt(fila) + 1).toString() + '' + columna.toString();
            break;
        case 'HR':
            new_coord = fila.toString() + '' + (parseInt(columna) + 1).toString();
            break;
        case 'HL':
            new_coord = fila.toString() + '' + (parseInt(columna) - 1).toString();
            break;
        case 'DLT':
            new_coord = (parseInt(fila) - 1).toString() + '' + (parseInt(columna) - 1).toString();
            break;
        case 'DLB':
            new_coord = (parseInt(fila) + 1).toString() + '' + (parseInt(columna) - 1).toString();
            break;
        case 'DRT':
            new_coord = (parseInt(fila) - 1).toString() + '' + (parseInt(columna) + 1).toString();
            break;
        case 'DRB':
            new_coord = (parseInt(fila) + 1).toString() + '' + (parseInt(columna) + 1).toString();
            break;
    }

    return new_coord;
}
function verFreeMovFichaTorre(nivel, fichaTorre)
{
    var nroMovimientos = 0;
    var direcciones = ['VT', 'VB', 'HR', 'HL', 'DLT', 'DLB', 'DRT', 'DRB'];
    var len_direcc = direcciones.length;
    var new_coord;
    var coord_nv1 = '';
    var celda = fichaTorre.dataset.celda;
    var camino_1, camino_2;
    var fila, columna;

    for(var i = 0; i < len_direcc; ++i) {
        new_coord = getNewCoord(direcciones[i], celda);
        camino_1 = celda + '-' + new_coord;
        camino_2 = new_coord + '-' + celda;

        if (document.getElementById(new_coord) && (document.getElementById(camino_1) || document.getElementById(camino_2))) {
            if (nivel == 2) {
                coord_nv1 = new_coord;
                new_coord = getNewCoord(direcciones[i], new_coord);
                camino_1 = coord_nv1 + '-' + new_coord;
                camino_2 = new_coord + '-' + coord_nv1;

                // Verificando si la celda pertenece a la torre
                fila = parseInt(new_coord.substring(0, 1));
                columna = parseInt(new_coord.substring(1));

                if (fila < 4 && (columna > 2 && columna < 6)) {
                    // Verificando si existe una ficha que pueda ser comida
                    if (document.getElementById(coord_nv1).dataset.tipoFicha == 'c') {
                        if (document.getElementById(new_coord)) {
                            if (document.getElementById(new_coord).dataset.tipoFicha == ''){
                                ++nroMovimientos;
                            }
                        }
                    }
                } // End if
            } else {
                // Verificando si la celda pertenece a la torre
                fila = parseInt(new_coord.substring(0, 1));
                columna = parseInt(new_coord.substring(1));

                if (fila < 4 && (columna > 2 && columna < 6)) {
                    if (document.getElementById(new_coord)) {
                        if (document.getElementById(new_coord).dataset.tipoFicha == ''){
                            ++nroMovimientos;
                        }
                    }
                } // End if
            } // End if

        } // End if
    } // End for

    return nroMovimientos;
}

/** IS FREE SPACES FOR ATACANTES*/
function isFreeVT(nivel, _ficha)
{
    var sePuedeMover = false;
    var data = new Array('VT', '', '', 'noComestible');
    var coordenadas = getCoordenadas(_ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f - nivel;
    var new_c = c;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada_fc(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            sePuedeMover = true;
            data[1] = coordenadas[0].toString() + coordenadas[1].toString();
            data[2] = new_coord.toString();

            pintarLinea(_ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return [sePuedeMover, data];
}
function isFreeHR(nivel, _ficha)
{
    var sePuedeMover = false;
    var data = new Array('HR', '', '', 'noComestible');
    var coordenadas = getCoordenadas(_ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f;
    var new_c = parseInt(c) + nivel;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada_fc(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            sePuedeMover = true;
            data[1] = coordenadas[0].toString() + coordenadas[1].toString();
            data[2] = new_coord.toString();

            pintarLinea(_ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return [sePuedeMover, data];
}
function isFreeHL(nivel, _ficha)
{
    var sePuedeMover = false;
    var data = new Array('HL', '', '', 'noComestible');
    var coordenadas = getCoordenadas(_ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f;
    var new_c = parseInt(c) - nivel;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada_fc(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            sePuedeMover = true;
            data[1] = coordenadas[0].toString() + coordenadas[1].toString();
            data[2] = new_coord.toString();

            pintarLinea(_ficha.dataset.celda, new_coord);
            pintarCelda(new_coord);
        }
    }

    return [sePuedeMover, data];
}
function isFreeDLT(nivel, _ficha)
{
    var sePuedeMover = false;
    var data = new Array('DLT', '', '', 'noComestible');
    var coordenadas = getCoordenadas(_ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f - nivel;
    var new_c = c - nivel;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada_fc(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            // Verificar camino disponible para mover
            ficha = _ficha;
            if (verificarCoordenada(new_coord)) {
                sePuedeMover = true;
                data[1] = coordenadas[0].toString() + coordenadas[1].toString();
                data[2] = new_coord.toString();

                pintarLinea(_ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }
    }

    return [sePuedeMover, data];
}
function isFreeDRT(nivel, _ficha)
{
    var sePuedeMover = false;
    var data = new Array('DRT', '', '', 'noComestible');
    var coordenadas = getCoordenadas(_ficha);
    var f = coordenadas[0];
    var c = coordenadas[1];
    var new_f = f - nivel;
    var new_c = parseInt(c) + nivel;
    var new_coord = new_f + '' + new_c;
    var bool = verificarCoordenada_fc(new_coord);

    if (bool) {
        bool = verificarDisponibilidad(new_coord);

        // Pintando la celda disponible
        if (bool) {
            // Verificar camino disponible para mover
            ficha = _ficha;
            if (verificarCoordenada(new_coord)) {
                sePuedeMover = true;
                data[1] = coordenadas[0].toString() + coordenadas[1].toString();
                data[2] = new_coord.toString();

                pintarLinea(_ficha.dataset.celda, new_coord);
                pintarCelda(new_coord);
            }
        }
    }

    return [sePuedeMover, data];
}

/** IS FREE SPACES FOR DEFENSORES (TORRE)*/