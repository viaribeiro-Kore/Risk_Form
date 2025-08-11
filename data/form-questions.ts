// Define os tipos para garantir a consistência dos dados
export type QuestionType = "radio" | "checkbox";

export interface Question {
  id: string; // Um identificador único para cada pergunta
  text: string;
  type: QuestionType;
  options: string[];
  required: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

// Array com todas as seções e perguntas do formulário
export const formSections: FormSection[] = [
  {
    id: "secaoA",
    title: "A. Objetivo e Horizonte de Investimento",
    questions: [
      {
        id: "objetivo_principal",
        text: "Qual o objetivo principal do seu investimento em ativos digitais?",
        type: "radio",
        required: true,
        options: [
          "Preservação de patrimônio",
          "Aumento gradual",
          "Alto crescimento",
          "Especulação",
        ],
      },
      {
        id: "horizonte_investimento",
        text: "Qual seu horizonte de investimento para ativos digitais?",
        type: "radio",
        required: true,
        options: [
          "Menos de 6 meses",
          "6 a 12 meses",
          "1 a 3 anos",
          "Mais de 3 anos",
        ],
      },
    ],
  },
  {
    id: "secaoB",
    title: "B. Tolerância à Volatilidade e Perdas",
    questions: [
      {
        id: "reacao_queda_30",
        text: "Se sua carteira digital cair 30% em uma semana, você:",
        type: "radio",
        required: true,
        options: [
          "Compraria mais",
          "Manteria tudo",
          "Realizaria parte do prejuízo, manteria algum capital exposto",
          "Zeraria tudo",
        ],
      },
      {
        id: "perda_maxima_12m",
        text: "Qual o nível máximo de perda temporária que você aceitaria em 12 meses?",
        type: "radio",
        required: true,
        options: ["Até 30%", "Até 50%", "Até 70%", "Acima de 70%"],
      },
    ],
  },
  {
    id: "secaoC",
    title: "C. Conhecimento Prático",
    questions: [
      {
        id: "avaliacao_conhecimento",
        text: "Como você avalia seu conhecimento sobre ativos digitais?",
        type: "radio",
        required: true,
        options: [
          "Iniciante (só Bitcoin/Ethereum)",
          "Intermediário (já usou exchanges, alguma diversificação)",
          "Avançado (usa DEX, staking, DeFi)",
          "Especialista (smart contracts, bridges, múltiplas blockchains)",
        ],
      },
      {
        id: "ativos_usados",
        text: "Quais desses ativos ou soluções você já usou? (marque todos)",
        type: "checkbox",
        required: true,
        options: [
          "Stablecoins USDC, DAI, etc.",
          "Altcoins ex: SOL, ADA, LINK",
          "NFTs",
          "DeFi staking, lending, farming",
          "Tokens sintéticos ou RWA",
          "Layer 2 e bridges",
          "Testnets ou protocolos experimentais",
          "Nenhum",
        ],
      },
    ],
  },
  {
    id: "secaoD",
    title: "D. Comportamento em Risco",
    questions: [
        {
            id: "reacao_valorizacao_100",
            text: "Caso algum ativo valorize 100% em 1 mês, você tende a:",
            type: "radio",
            required: true,
            options: [
                "Vender quase tudo",
                "Realizar parte pequena",
                "Manter tudo",
                "Aumentar posição all-in"
            ]
        },
        {
            id: "alocacao_carteira",
            text: "Quanto da sua carteira total você gostaria de alocar em ativos digitais?",
            type: "radio",
            required: true,
            options: [
                "Até 5%",
                "6% a 20%",
                "21% a 50%",
                "Mais de 50%"
            ]
        }
    ]
  },
  {
    id: "secaoE",
    title: "E. Exposição Tecnológica",
    questions: [
        {
            id: "custodia_ativos",
            text: "Em relação à custódia dos seus ativos digitais, você prefere:",
            type: "radio",
            required: true,
            options: [
                "Delegar a terceiros",
                "Auto-custódia com suporte",
                "Total autonomia em auto-custódia"
            ]
        },
        {
            id: "exposicao_experimental",
            text: "Sobre exposição a ativos ou projetos experimentais:",
            type: "radio",
            required: true,
            options: [
                "Só blockchains blue chip",
                "Aceito pequena parte em projetos novos",
                "Busco exposição relevante",
                "Sempre busco projetos experimentais"
            ]
        }
    ]
  }
];