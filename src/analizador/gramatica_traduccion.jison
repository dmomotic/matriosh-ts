  /* Definición Léxica */
%lex

%options case-sensitive

%%

\s+											                // espacios en blanco
"//".*										              // comentario simple
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//Palabras reservadas
'string' return 'string';
'number' return 'number';
'boolean' return 'boolean';
'void' return 'void';
'type' return 'type';
'let' return 'let';
'const' return 'const';
'console' return 'console';
'log' return 'log';
'function' return 'function';
'return' return 'return';
'null' return 'null';
'push' return 'push';
'length' return 'length';

//Signos
';' return 'punto_coma';
',' return 'coma';
':' return 'dos_puntos';
'{' return 'llave_izq';
'}' return 'llave_der';
'(' return 'par_izq';
')' return 'par_der';
'[' return 'cor_izq';
']' return 'cor_der';
'.' return 'punto';
'++' return 'mas_mas'
'+' return 'mas';
'--' return 'menos_menos'
'-' return 'menos';
'**' return 'potencia';
'*' return 'por';
'/' return 'div';
'%' return 'mod';
'>' return 'mayor';
'<' return 'menor';
'>=' return 'mayor_igual';
'<=' return 'menor_igual';
'==' return 'igual_que';
'=' return 'igual';
'!=' return 'dif_que';
'&&' return 'and';
'||' return 'or';
'!' return 'not';



//Patrones (Expresiones regulares)
\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'string'; }
[0-9]+("."[0-9]+)?\b  	return 'number';
([a-zA-Z])[a-zA-Z0-9_]* return 'id';

//Fin del archivo
<<EOF>>				return 'EOF';
//Errores lexicos
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylineno + ', en la columna: ' + yylloc.first_column); }
/lex

//Imports
%{
  const { NodoAST } = require('../arbol/nodoAST');
%}

/* Asociación de operadores y precedencia */
// https://entrenamiento-python-basico.readthedocs.io/es/latest/leccion3/operadores_aritmeticos.html
%left 'or'
%left 'and'
%left 'not'
%left 'igual_que' 'dif_que'
%left 'mayor' 'menor' 'mayor_igual' 'menor_igual'
%left 'mas' 'menos'
%left 'por' 'div' 'mod'
%left 'umenos'
%right 'potencia'
%left 'mas_mas' 'menos_menos'

%start S

%%

//Definición de la Grámatica

/*YA*/
S
  : INSTRUCCIONES EOF { return new NodoAST({label: 'S', hijos: [$1], linea: yylineno}); }
;
/*YA*/
INSTRUCCIONES
  : INSTRUCCIONES INSTRUCCION  { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos, ...$2.hijos], linea: yylineno}); }
  | INSTRUCCION                { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos], linea: yylineno}); }
;

INSTRUCCION
  : DECLARACION_VARIABLE { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | CONSOLE_LOG { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | DECLARACION_FUNCION { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | RETURN { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | DECLARACION_TYPE { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | PUSH_ARREGLO { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | INSTRUCCION_IF
;

PUSH_ARREGLO
  : id punto push par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'PUSH_ARREGLO', hijos: [$1,$5], linea: yylineno}); }
  | id LISTA_ACCESOS_TYPE punto push par_izq EXP par_der punto_coma{ $$ = new NodoAST({label: 'PUSH_ARREGLO', hijos: [$1,$2,$6], linea: yylineno}); }
;

DECLARACION_FUNCION
  //Funcion sin parametros -> function test() : TIPO { INSTRUCCIONES } --> YA <--
  : function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION', hijos: [$1, $2, $3, $4, $5, $6, $7, $8, $9], linea: yylineno}); }
  //Funcion con parametros -> function test ( LISTA_PARAMETROS ) : TIPO { INSTRUCCIONES }
  | function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION', hijos: [$1, $2, $3, $4, $5, $6, $7, $8, $9, $10], linea: yylineno}); }
;

LISTA_PARAMETROS
  : LISTA_PARAMETROS coma PARAMETRO { $$ = new NodoAST({label: 'LISTA_PARAMETROS', hijos: [...$1.hijos, $3], linea: yylineno}); } //Revisar si agrego o no coma
  | PARAMETRO { $$ = new NodoAST({label: 'LISTA_PARAMETROS', hijos: [$1], linea: yylineno}); }
;

PARAMETRO
  : id dos_puntos TIPO_VARIABLE_NATIVA { $$ = new NodoAST({label: 'PARAMETRO', hijos: [$1, $2, $3], linea: yylineno}); }
;

RETURN
  : return EXP punto_coma { $$ = new NodoAST({label: 'RETURN', hijos: [$1, $2, $3], linea: yylineno}); }
;

DECLARACION_TYPE
  : type id igual llave_izq LISTA_ATRIBUTOS llave_der { $$ = new NodoAST({label: 'DECLARACION_TYPE', hijos: [$1, $2, $3, $4, $5, $6], linea: yylineno}); }
;

LISTA_ATRIBUTOS
  : ATRIBUTO coma LISTA_ATRIBUTOS { $$ = new NodoAST({label: 'LISTA_ATRIBUTOS', hijos: [$1, ...$3.hijos], linea: yylineno}); } //Revisar si agrego o no coma
  | ATRIBUTO { $$ = new NodoAST({label: 'LISTA_ATRIBUTOS', hijos: [$1], linea: yylineno}); }
;

ATRIBUTO
  : id dos_puntos TIPO_VARIABLE_NATIVA { $$ = new NodoAST({label: 'ATRIBUTO', hijos: [$1, $2, $3], linea: yylineno}); }
  | id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES { $$ = new NodoAST({label: 'ATRIBUTO', hijos: [$1,$2,$3,$4], linea: yylineno}); }
;

DECLARACION_VARIABLE
  //let id ;  --> YA <--
  : TIPO_DEC_VARIABLE id punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3], linea: yylineno});  }

  //let id : TIPO_VARIABLE_NATIVA ;
  | TIPO_DEC_VARIABLE id dos_puntos TIPO_VARIABLE_NATIVA punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3, $4, $5], linea: yylineno}); }

  //let id : TIPO_VARIABLE_NATIVA LISTA_CORCHETES ;
  | TIPO_DEC_VARIABLE id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3, $4, $5, $6], linea: yylineno}); }

  //let id = EXP ;
  | TIPO_DEC_VARIABLE id igual EXP punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3, $4, $5], linea: yylineno}); }

  //let id : TIPO_VARIABLE_NATIVA = EXP;
  | TIPO_DEC_VARIABLE id dos_puntos TIPO_VARIABLE_NATIVA igual EXP punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno});}

  //let id : TIPO_VARIABLE_NATIVA LISTA_CORCHETES = EXP ;
  | TIPO_DEC_VARIABLE id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES igual EXP punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
;

LISTA_CORCHETES
  : LISTA_CORCHETES cor_izq cor_der { $$ = new NodoAST({label: 'LISTA_CORCHETES', hijos: [...$1.hijos, '[]'], linea: yylineno}); }
  | cor_izq cor_der { $$ = new NodoAST({label: 'LISTA_CORCHETES', hijos: ['[]'], linea: yylineno}); }
;

EXP
  //Operaciones Aritmeticas
  : menos EXP %prec umenos { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  | EXP mas EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP menos EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP por EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP div EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP mod EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP potencia EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP mas_mas  { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  | EXP menos_menos  { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  //Operaciones de Comparacion
  | EXP mayor EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP menor EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP mayor_igual EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP menor_igual EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP igual_que EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP dif_que EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  //Operaciones Lógicas
  | EXP and EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP or EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | not EXP { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  //Valores Primitivos
  | number  { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'NUMBER', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | string  { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'STRING', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | id  { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'ID', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  //Arreglos
  | cor_izq LISTA_EXPRESIONES cor_der { $$ = new NodoAST({label: 'EXP', hijos: [$1,$2,$3], linea: yylineno}); }
  | cor_izq cor_der { $$ = new NodoAST({label: 'EXP', hijos: ['[]'], linea: yylineno}); }
  | ACCESO_ARREGLO { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
  | LENGTH_ARREGLO { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
  //Types - accesos
  | ACCESO_TYPE { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
;

LENGTH_ARREGLO
  : ACCESO_ARREGLO punto length { $$ = new NodoAST({label: 'LENGTH_ARREGLO', hijos: [$1,$2,$3], linea: yylineno}); }
;

ACCESO_ARREGLO
  : id LISTA_ACCESOS_ARREGLO { $$ = new NodoAST({label: 'ACCESO_ARREGLO', hijos: [$1, $2], linea: yylineno}); }
;

ACCESO_TYPE
  : id LISTA_ACCESOS_TYPE { $$ = new NodoAST({label: 'ACCESO_TYPE', hijos: [$1, ...$2.hijos], linea: yylineno}); }
;

LISTA_ACCESOS_TYPE
  : LISTA_ACCESOS_TYPE punto id { $$ = new NodoAST({label: 'LISTA_ACCESOS_TYPE', hijos: [...$1.hijos, $3], linea: yylineno}); }
  | punto id { $$ = new NodoAST({label: 'LISTA_ACCESOS_TYPE', hijos: [$2], linea: yylineno}); }
  | LISTA_ACCESOS_TYPE punto id LISTA_ACCESOS_ARREGLO { $$ = new NodoAST({label: 'LISTA_ACCESOS_TYPE', hijos: [...$1.hijos, $3, $4], linea: yylineno}); }
  | punto id LISTA_ACCESOS_ARREGLO { $$ = new NodoAST({label: 'LISTA_ACCESOS_TYPE', hijos: [$2,$3], linea: yylineno}); }
;

LISTA_ACCESOS_ARREGLO
  : LISTA_ACCESOS_ARREGLO cor_izq EXP cor_der { $$ = new NodoAST({label: 'LISTA_ACCESOS_ARREGLO', hijos: [...$1.hijos, $3], linea: yylineno}); }
  | cor_izq EXP cor_der { $$ = new NodoAST({label: 'LISTA_ACCESOS_ARREGLO', hijos: [$2], linea: yylineno}); }
;

LISTA_EXPRESIONES
  : LISTA_EXPRESIONES coma EXP { $$ = new NodoAST({label: 'LISTA_EXPRESIONES', hijos: [...$1.hijos, $3], linea: yylineno}); }
  | EXP { $$ = new NodoAST({label: 'LISTA_EXPRESIONES', hijos: [$1], linea: yylineno}); }
;

TIPO_DEC_VARIABLE
  : let       { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | const     { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
;

TIPO_VARIABLE_NATIVA
  : string  { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | number  { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | boolean { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | void    { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | id      { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [new NodoAST({label: 'ID', hijos: [$1], linea: yylineno})], linea: yylineno}); }
;

CONSOLE_LOG
  //console.log(EXP);
  : console punto log par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'CONSOLE_LOG', hijos: [$1, $2, $3, $4, $5, $6, $7], linea: yylineno}); }
;
