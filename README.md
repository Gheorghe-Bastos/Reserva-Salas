# reserva-salas

Sistema corporativo de reserva de salas de reunião. Permite visualizar salas, criar/editar/excluir reservas e verificar conflitos de horário em tempo real.
Link da aplicação: https://reserva-salas-sable.vercel.app/
---

## Stack

| Camada       | Tecnologia                                                         |
| ------------ | ------------------------------------------------------------------ |
| Frontend     | React, TypeScript, Vite, Tailwind CSS                              |
| Componentes  | Base UI React, shadcn/ui (CVA, clsx, tailwind-merge, Lucide icons) |
| Roteamento   | React Router v7                                                    |
| Backend/DB   | Supabase (PostgreSQL)                                              |
| Deploy       | Vercel                                                             |

Dependências instaladas mas **não utilizadas** no código atual: `@tanstack/react-query`, `zod`, `@hookform/resolvers`. O projeto faz chamadas diretas à SDK do Supabase com `useState`/`useEffect`.

---

## Setup

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd reserva-salas
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 3. Estrutura do banco (Supabase)

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  reservation_name TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  participants_count INTEGER NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reservations_room_time ON reservations(room_id, starts_at, ends_at);
```

### 4. Rodar

```bash
npm run dev
```

### 5. Build / Preview

```bash
npm run build
npm run preview
```

---

## Premissas e Decisões

### Reservas que encostam (termina 14h, outra começa 14h)
**Não são conflito.** A checagem usa `starts_at < endsAt AND ends_at > startsAt` (comparações exclusivas), então um horário limite pertence à reserva anterior e a seguinte pode começar no mesmo minuto.

### Horário de funcionamento
**08h–18h, seg–sex.** O frontend valida no formulário; o backend (Supabase) não tem uma constraint de CHECK — a validação é feita exclusivamente no cliente.

### Editar reserva com conflito
**Bloqueia com a mesma lógica da criação.** Ao editar horários, a função `checkReservationConflict` é chamada excluindo o ID da própria reserva (`excludeId`), evitando falso conflito consigo mesma.

### Comunicação de conflito no front
O modal exibe um banner de erro com a mensagem:  
`"Sala X já reservada das Y às Z"`  
O usuário vê o conflito antes de fechar o modal e pode ajustar os horários.

### Salas mockadas
Atualmente as salas vêm de um array fixo em `useRooms.ts`. Reservas vêm do Supabase.

### Fuso horário
O frontend converte horário local do usuário para ISO UTC antes de enviar ao banco. A exibição faz o caminho inverso.

---

## Pergunta de Raciocínio: Reservas Recorrentes

**"Como evoluir este sistema para suportar reservas recorrentes (ex.: 'toda terça às 14h, pelos próximos 3 meses')?"**

Para suportar reservas recorrentes, eu criaria o conceito de uma regra de recorrência. Em vez de o usuário cadastrar manualmente cada reserva, ele informaria um padrão, por exemplo: "toda terça-feira às 14h durante os próximos três meses".

A partir dessa regra, o sistema geraria automaticamente todas as reservas correspondentes ao período informado. Antes de criar cada uma delas, a mesma validação de conflito já existente seria aplicada para garantir que não haja sobreposição de horários. Caso algum conflito fosse encontrado, o sistema informaria ao usuário quais ocorrências não puderam ser criadas, enquanto as demais poderiam ser cadastradas normalmente.

Essa abordagem reaproveita a lógica de criação e validação de reservas já existente, evita trabalho repetitivo para o usuário e mantém o comportamento do sistema consistente, independentemente de a reserva ser única ou recorrente. Além disso, ela permite futuras evoluções, como editar apenas uma ocorrência específica ou toda a série de reservas.

### Checagem de conflito

A checagem atual compara `starts_at` e `ends_at` no banco. Para recorrentes, duas abordagens:

1. **Pré-calcular e inserir todas as ocorrências** no momento da criação (como registros individuais na tabela `reservations`). A checagem de conflito existente funciona sem alterações — cada ocorrência é verificada individualmente. Se alguma ocorrência futura conflitar, a criação inteira é rejeitada e o frontend informa qual data conflita.

2. **Manter a regra de recorrência e calcular conflitos por intervalo**. A checagem de conflito precisaria aceitar um intervalo de datas (`start_date` a `end_date`) e verificar se, para cada data gerada pela regra, o slot está livre. Isso é mais eficiente em armazenamento mas requer uma função no banco (PL/pgSQL) que itera as datas e verifica overlaps.

**Recomendação:** Abordagem híbrida — criar a `recurring_rules` para gerenciamento da recorrência (editar regra, pular ocorrência, excluir série) e armazenar cada ocorrência como uma `reservation` individual (com `recurring_rule_id` opcional). A checagem de conflito é feita iterando as datas da regra contra a query `lt/gt` existente. Caso alguma data conflite, a série não é criada e o usuário vê quais dias estão ocupados.

