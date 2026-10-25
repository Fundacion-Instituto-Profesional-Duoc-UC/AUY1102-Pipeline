/**
 * Script de Auditoría de Pruebas Unitarias y Análisis de Cobertura
 * Asignatura: Ciclo de Vida del Software I (AUY1102) - Evaluación Parcial 2
 * Autores: Isidro Benítez & Rafael Heneche
 *
 * Funcionalidades clave:
 * 1. Ejecución automatizada de pruebas unitarias existentes con Jest.
 * 2. Cálculo y visualización del porcentaje de cobertura global y por módulo.
 * 3. Identificación y despliegue en consola de pruebas que fallan (con mensaje y stack).
 * 4. Desglose detallado de qué partes del código y qué líneas NO han sido cubiertas por pruebas.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const resultsPath = path.join(rootDir, 'jest-results.json');
const coverageSummaryPath = path.join(rootDir, 'coverage', 'coverage-summary.json');
const coverageFinalPath = path.join(rootDir, 'coverage', 'coverage-final.json');

console.log('\n========================================================================================');
console.log('             DUOC UC - CICLO DE VIDA DEL SOFTWARE I (AUY1102)                           ');
console.log('         EVALUACIÓN PARCIAL N° 2: SUITE DE PRUEBAS UNITARIAS Y COBERTURA                ');
console.log('========================================================================================\n');
console.log('[PASO 1/3] Iniciando ejecución de pruebas unitarias y motor de cobertura (Jest/SWC)...');

// Usar npx con tolerancia a rutas con espacios en Windows
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const jestArgs = [
  'jest',
  '--coverage',
  '--coverageReporters=text',
  '--coverageReporters=json-summary',
  '--coverageReporters=json',
  '--json',
  `--outputFile="${resultsPath}"`,
  '--passWithNoTests'
];

const startTime = Date.now();
const result = spawnSync(npxCmd, jestArgs, {
  cwd: rootDir,
  encoding: 'utf-8',
  shell: true,
  env: { ...process.env, NODE_ENV: 'test' }
});
const duration = ((Date.now() - startTime) / 1000).toFixed(2);

// Leer resultados de Jest
let jestOutput = null;
if (fs.existsSync(resultsPath)) {
  try {
    jestOutput = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  } catch (err) {
    console.error('Error al parsear jest-results.json:', err.message);
  }
}

// Leer resumen de cobertura
let coverageSummary = null;
if (fs.existsSync(coverageSummaryPath)) {
  try {
    coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
  } catch (err) {
    console.error('Error al parsear coverage-summary.json:', err.message);
  }
}

// Leer detalle de líneas descubiertas desde coverage-final.json
let coverageFinal = null;
if (fs.existsSync(coverageFinalPath)) {
  try {
    coverageFinal = JSON.parse(fs.readFileSync(coverageFinalPath, 'utf8'));
  } catch (err) {
    // Si no existe, se continúa
  }
}

function getUncoveredLines(filePath) {
  if (!coverageFinal || !coverageFinal[filePath]) return 'N/A';
  const fileData = coverageFinal[filePath];
  const statementMap = fileData.statementMap || {};
  const s = fileData.s || {};
  const uncoveredLines = new Set();

  Object.keys(s).forEach((stId) => {
    if (s[stId] === 0 && statementMap[stId]) {
      const startLine = statementMap[stId].start.line;
      const endLine = statementMap[stId].end.line;
      for (let l = startLine; l <= endLine; l++) {
        uncoveredLines.add(l);
      }
    }
  });

  const sortedLines = Array.from(uncoveredLines).sort((a, b) => a - b);
  if (sortedLines.length === 0) return 'Ninguna (100% cubierto)';

  // Agrupar en rangos legibles (ej: 8-10, 15)
  const ranges = [];
  let rangeStart = null;
  let prevLine = null;

  sortedLines.forEach((line) => {
    if (rangeStart === null) {
      rangeStart = line;
      prevLine = line;
    } else if (line === prevLine + 1) {
      prevLine = line;
    } else {
      ranges.push(rangeStart === prevLine ? `${rangeStart}` : `${rangeStart}-${prevLine}`);
      rangeStart = line;
      prevLine = line;
    }
  });

  if (rangeStart !== null) {
    ranges.push(rangeStart === prevLine ? `${rangeStart}` : `${rangeStart}-${prevLine}`);
  }

  return ranges.join(', ');
}

console.log(`[PASO 2/3] Pruebas ejecutadas en ${duration} s.\n`);

// ---------------------------------------------------------------------
// SECCIÓN 1: ESTADO DE LAS PRUEBAS UNITARIAS Y PRUEBAS QUE FALLAN
// ---------------------------------------------------------------------
console.log('========================================================================================');
console.log('                      1. INFORME DE PRUEBAS UNITARIAS EJECUTADAS                        ');
console.log('========================================================================================');

if (jestOutput) {
  const { numTotalTests, numPassedTests, numFailedTests, numPendingTests, testResults } = jestOutput;
  console.log(`• Total de Suites de Pruebas: ${testResults.length}`);
  console.log(`• Total de Pruebas Unitarias: ${numTotalTests}`);
  console.log(`  ✔ Pruebas Aprobadas (Passed) : ${numPassedTests}`);
  console.log(`  ✖ Pruebas Falladas  (Failed) : ${numFailedTests}`);
  console.log(`  - Pruebas Omitidas  (Pending): ${numPendingTests}`);

  console.log('\n--- EVALUACIÓN DE PRUEBAS QUE FALLAN ---');
  if (numFailedTests === 0) {
    console.log('✔ [ESTADO ÓPTIMO] No se registraron pruebas unitarias fallidas (0 fallas).');
    console.log('  Todas las especificaciones pasaron exitosamente.');
  } else {
    console.log(`✖ [ALERTA DE ERROR] Se encontraron ${numFailedTests} prueba(s) fallida(s):\n`);
    testResults.forEach((suite) => {
      const failed = suite.assertionResults.filter(a => a.status === 'failed');
      if (failed.length > 0) {
        const relPath = path.relative(rootDir, suite.name).replace(/\\/g, '/');
        console.log(`  Suite Afectada: ${relPath}`);
        failed.forEach((f, idx) => {
          console.log(`    [Falla #${idx + 1}] ${f.ancestorTitles.join(' > ')} -> ${f.title}`);
          if (f.failureMessages && f.failureMessages.length > 0) {
            console.log(`      Causa: ${f.failureMessages[0].split('\n')[0]}`);
          }
        });
      }
    });
  }
} else {
  console.log('Salida directa de Jest:');
  console.log(result.stdout || result.stderr);
}

// ---------------------------------------------------------------------
// SECCIÓN 2: PORCENTAJES DE COBERTURA Y CÓDIGO NO CUBIERTO
// ---------------------------------------------------------------------
console.log('\n========================================================================================');
console.log('              2. ANÁLISIS DE COBERTURA DE CÓDIGO Y LÍNEAS NO CUBIERTAS                  ');
console.log('========================================================================================');

if (coverageSummary) {
  const total = coverageSummary.total;
  console.log('MÉTRICAS GLOBALES DE COBERTURA:');
  console.log(`  • Declaraciones (Statements): ${total.statements.pct}%  (${total.statements.covered}/${total.statements.total})`);
  console.log(`  • Ramas Lógicas (Branches)  : ${total.branches.pct}%  (${total.branches.covered}/${total.branches.total})`);
  console.log(`  • Funciones     (Functions) : ${total.functions.pct}%  (${total.functions.covered}/${total.functions.total})`);
  console.log(`  • Líneas        (Lines)     : ${total.lines.pct}%  (${total.lines.covered}/${total.lines.total})`);

  console.log('\nTABLA DETALLADA: ARCHIVO | COBERTURA | LÍNEAS EXACTAS NO CUBIERTAS:');
  console.log('-'.repeat(95));
  console.log(
    'Archivo'.padEnd(46) +
    '% Declaraciones'.padEnd(16) +
    '% Líneas'.padEnd(12) +
    'Líneas No Cubiertas'
  );
  console.log('-'.repeat(95));

  const criticalFiles = [];
  const partialFiles = [];
  const fullFiles = [];

  Object.keys(coverageSummary).forEach((filePath) => {
    if (filePath === 'total') return;
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const data = coverageSummary[filePath];
    const uncovered = getUncoveredLines(filePath);

    if (data.lines.pct === 100) {
      fullFiles.push(relPath);
    } else if (data.lines.pct === 0) {
      criticalFiles.push({ file: relPath, total: data.lines.total });
    } else {
      partialFiles.push({ file: relPath, pct: data.lines.pct, uncovered });
    }

    console.log(
      relPath.padEnd(46) +
      `${data.statements.pct}%`.padEnd(16) +
      `${data.lines.pct}%`.padEnd(12) +
      uncovered
    );
  });

  console.log('-'.repeat(95));

  console.log('\n--- DIAGNÓSTICO DE COMPONENTES SIN COBERTURA (DEUDA TÉCNICA) ---');
  if (criticalFiles.length > 0) {
    console.log('Archivos con 0% de cobertura (Cero pruebas unitarias asociadas):');
    criticalFiles.forEach(c => {
      console.log(`  [0% COBERTURA] ${c.file} -> Requiere creación urgente de pruebas unitarias.`);
    });
  }
  if (partialFiles.length > 0) {
    console.log('\nArchivos con cobertura parcial (Riesgo de regresiones no detectadas):');
    partialFiles.forEach(p => {
      console.log(`  [PARCIAL ${p.pct}%] ${p.file} -> Líneas faltantes: ${p.uncovered}`);
    });
  }
}

console.log('\n========================================================================================');
console.log('  [PASO 3/3] Auditoría finalizada con éxito. Reporte listo para entrega.');
console.log('========================================================================================\n');

process.exit(0);