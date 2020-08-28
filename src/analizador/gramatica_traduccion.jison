  /* Definición Léxica */
%lex

%options case-sensitive

%%

\s+											                // espacios en blanco
"//".*										              // comentario simple
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//Palabras reservadas
'string' return 'r_string';
'number' return 'r_number';
'boolean' return 'r_boolean';
'void' return 'r_void';
'type' return 'r_type';
'let' return 'r_let';
'const' return 'r_const';
'console' return 'r_console';
'log' return 'r_log';
'if' return 'if';
'else' return 'else';
'function' return 'function';
'return' return 'return';


//Signos
';' return 'punto_coma';
',' return 'coma';
':' return 'dos_puntos';
'=' return 'igual';
'{' return 'llave_izq';
'}' return 'llave_der';
'(' return 'par_izq';
')' return 'par_der';
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
S
  : INSTRUCCIONES EOF { return new NodoAST({label: 'S', hijos: [$1], linea: yylineno}); }
;

INSTRUCCIONES
  : INSTRUCCIONES INSTRUCCION  { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos, ...$2.hijos], linea: yylineno}); }
  | INSTRUCCION                { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos], linea: yylineno}); }
;

INSTRUCCION
  : DECLARACION_VARIABLE { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | CONSOLE_LOG { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | DECLARACION_FUNCION { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | RETURN { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
;

DECLARACION_FUNCION
  //Funcion sin parametros -> function test() : TIPO { INSTRUCCIONES }
  : function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION', hijos: [$1, $2, $3, $4, $5, $6, $7, $8, $9], linea: yylineno}); }
  //Funcion con parametros -> function test ( LISTA_PARAMETROS ) : TIPO { INSTRUCCIONES }
  | function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION', hijos: [$1, $2, $3, $4, $5, $6, $7, $8, $9, $10], linea: yylineno}); }
;

LISTA_PARAMETROS
  : LISTA_PARAMETROS coma PARAMETRO { $$ = new NodoAST({label: 'LISTA_PARAMETROS', hijos: [...$1.hijos, $2, $3], linea: yylineno}); }
  | PARAMETRO { $$ = new NodoAST({label: 'LISTA_PARAMETROS', hijos: [$1], linea: yylineno}); }
;

PARAMETRO
  : id dos_puntos TIPO_VARIABLE_NATIVA { $$ = new NodoAST({label: 'PARAMETRO', hijos: [$1, $2, $3], linea: yylineno}); }
;

RETURN
  : return EXP punto_coma { $$ = new NodoAST({label: 'RETURN', hijos: [$1, $2, $3], linea: yylineno}); }
;

DECLARACION_VARIABLE
  //let id ;
  : TIPO_DEC_VARIABLE id punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3], linea: yylineno});  }
  //let id : TIPO_VARIABLE_NATIVA ;
  | TIPO_DEC_VARIABLE id dos_puntos TIPO_VARIABLE_NATIVA punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3, $4, $5], linea: yylineno}); }
  //let id = EXP ;
  | TIPO_DEC_VARIABLE id igual EXP punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3, $4, $5], linea: yylineno}); }
  //let id : TIPO_VARIABLE_NATIVA = EXP;
  | TIPO_DEC_VARIABLE id dos_puntos TIPO_VARIABLE_NATIVA igual EXP punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno});}
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
;

TIPO_DEC_VARIABLE
  : r_let       { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | r_const     { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
;

TIPO_VARIABLE_NATIVA
  : r_string  { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | r_number  { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | r_boolean { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
  | r_void    { $$ = new NodoAST({label: 'TIPO_VARIABLE_NATIVA', hijos: [$1], linea: yylineno}); }
;

CONSOLE_LOG
  //console.log(EXP);
  : r_console punto r_log par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'CONSOLE_LOG', hijos: [$1, $2, $3, $4, $5, $6, $7], linea: yylineno}); }
;
