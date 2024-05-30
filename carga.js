import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';


export let options = {
  thresholds: {
    'http_req_duration': ['p(95)<2000'],       // Limite de tempo de resposta de 95% dos requests serem inferiores a 2000ms (2 segundos)
    'http_req_failed': ['rate<0.05'],          // Limitar para a taxa de erros ser menor que 5%
  },
  scenarios: {
    example_scenario: {
      executor: 'ramping-vus',
      startVUs: 5,                         // Carga inicial de 5 usuários virtuais
      stages: [
        { duration: '10s', target: 5 },    // Durante 10 segundos, permaneça 5 usuários virtuais
        { duration: '30s', target: 10 },   // Durante 30 segundos, aumente para 10 usuários virtuais
        { duration: '60s', target: 2 },    // Durante 60 segundos, reduza para 2 usuários virtuais
      ],
      gracefulRampDown: '0s',
    },
  },
};

export default function () {
  http.get('https://test.k6.io/pi.php?decimals=100');
  sleep(1);
}

// Função para calcular a taxa de erro
function calculateErrorRate() {
  return (errorCount / totalCount) * 100 + '%';
}

// Função para criar um HTML personalizado com a taxa de erro
function createCustomHTML() {
  return `
  <html>
    <head>
      <title>Relatório de Teste K6</title>
    </head>
    <body>
      <h1>Relatório de Teste K6</h1>
      <p>Taxa de Erro: ${calculateErrorRate()}</p>
    </body>
  </html>
  `;
}

// Função para manipular os resultados e gerar os relatórios HTML
export function handleSummary(data) {
  return {
      "result.html": htmlReport(data),
  };
}
