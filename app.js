new Vue({
    el: '#app',
    data: {
        running: false, // verifica se o jogo está rodando ou não
        playerLife: 100,
        monsterLife: 100,
        logs: []
    },
    computed: {
        hasResult() {
            // verifica se algum dos jogadores venceu(ocorre quando um dos dois fica com a life zerada)
            // Através dessa variavel computada eu verifico se exibo ou não o painel de resultados
            return this.playerLife == 0 || this.monsterLife == 0 
        }
    },
    methods: {
        startGame() {
            this.running = true
            this.playerLife = 100
            this.monsterLife = 100
            this.logs = []
        },
        attack(especial) {
            this.hurt('monsterLife', 5, 10, especial, 'Jogador', 'Monstro', 'player')
            if(this.monsterLife > 0) { // se por acaso o ataque anterior já matou o monstro não existe necessidade do monstro atacar mais uma vez
                this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
            }
        },
        // cls é a classe do log, source a origem do ataque e target quem vai receber o ataque
        hurt(prop, min, max, especial, source, target, cls) {// prop diz quem está atacando
            const plus = especial ? 5 : 0 // se a flag especial for true coloca uma potencia maior no golpe
            const hurt = this.getRandom(min + plus, max + plus)
            // pega o maior numero entre os dois
            // o math.max não deixa que o valor seja menor que 0(assim não preciso implementar a logica na minha implementação)
            this[prop] = Math.max(this[prop] - hurt, 0)// posso acessar a variavel via this.monsterLife ou this[string do nome da variavel]
            this.registerLog(`${source} atingiu ${target} com ${hurt}.`, cls)
        },
        healAndHurt() {
            this.heal(10, 15)
            this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
        },
        heal(min, max) {
            const heal = this.getRandom(min, max)
            this.playerLife = Math.min(this.playerLife + heal, 100) // pega o menor numero entre os dois
            this.registerLog(`Jogador ganhou força de ${heal}.`, 'player')
        },
        getRandom(min, max) {
            const value = Math.random() * (max - min) + min
            return Math.round(value)
        },
        registerLog(text, cls) {// recebe o texto e a classe aplicada no log
            this.logs.unshift({ text, cls }) // sempre coloca o valor mais recente na primeira posição
        }
    },
    watch: {
        /* ao mesmo tempo que a variavel computada me diz se exibo ou não resultado , ela tbm finaliza o jgo depois que alguem 
        vence, se hasResult tiver algum valor significa que o alguem venceu e o jogo acabou */
        hasResult(value) { 
            if (value) this.running = false
        }
    }
})