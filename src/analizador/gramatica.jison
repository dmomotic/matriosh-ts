  /* Definición Léxica */
%lex


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
'log' return 'r_log'


//Signos
';' return 's_punto_coma';
',' return 's_coma';
':' return 's_dos_puntos';
'=' return 's_igual';
'{' return 's_llave_izq';
'}' return 's_llave_der';
'(' return 's_par_izq';
')' return 's_par_der';
'.' return 's_punto';


//Patrones (Expresiones regulares)
\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'cadena'; }
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

%start S

%%

//Definición de la Grámatica
S
  : INSTRUCCIONES EOF { return new NodoAST({label: 'S', hijos: [$1], linea: yylineno}); }
;

INSTRUCCIONES
  : INSTRUCCIONES INSTRUCCION  {  /* $$ = new NodoAST({label: 'INSTRUCCIONES', hijos:[$1, $2], linea: yylineno}); */  { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos, ...$2.hijos], linea: yylineno}); }  }
  | INSTRUCCION                {/*   $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [$1], linea: yylineno}); */    $$ = $1; }
;

INSTRUCCION
  : DECLARACION_VARIABLE { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | CONSOLE_LOG { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
;

DECLARACION_VARIABLE
  //let id ;
  : TIPO_DEC_VARIABLE id s_punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3], linea: yylineno});  }
  //let id = EXP ;
  | TIPO_DEC_VARIABLE id s_igual EXP s_punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1, $2, $3, $4, $5], linea: yylineno}); }
  //let id : TIPO_VARIABLE_NATIVA = EXP;
  | TIPO_DEC_VARIABLE id s_dos_puntos TIPO_VARIABLE_NATIVA s_igual EXP s_punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno});}
;

EXP
  : number  { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
  | cadena  { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
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
  : r_console s_punto r_log s_par_izq EXP s_par_der s_punto_coma { $$ = new NodoAST({label: 'CONSOLE_LOG', hijos: [$1, $2, $3, $4, $5, $6, $7], linea: yylineno}); }
;
