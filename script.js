const reservas = []; // Estrutura para armazenar reservas

document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const churrasqueira = document.getElementById('grill').value;
    const socioTitulo = document.getElementById('title').value;
    const data = document.getElementById('date').value;
    const senha = document.getElementById('password').value;

    if (!validarSenha(senha)) {
        alert('A senha deve ter exatamente 6 dígitos.');
        return;
    }

    const agora = new Date();
    const dataReserva = new Date(data);

    if (dataReserva < agora) {
        alert('Não é possível reservar uma churrasqueira para uma data passada.');
        return;
    }

    const reservasDoSocio = reservas.filter(reserva => reserva.title === socioTitulo);
    const reservasNoMesmoDia = reservas.filter(reserva => reserva.date === data);
    const reservasParaMesmaChurrasqueira = reservasNoMesmoDia.filter(reserva => reserva.grill === churrasqueira);

    if (reservasParaMesmaChurrasqueira.length > 0) {
        alert('Esta churrasqueira já está reservada.');
        return;
    }

    if (reservasNoMesmoDia.some(reserva => reserva.title === socioTitulo)) {
        alert('Você já possui uma reserva para este dia.');
        return;
    }

    if (reservasDoSocio.length >= 2) {
        alert('Você já possui 2 reservas. Cancele uma reserva antes de marcar outra.');
        return;
    }

    fazerReserva(socioTitulo, churrasqueira, data, senha);
    limparFormulario();
});

function validarSenha(senha) {
    return senha.length === 6 && !isNaN(senha);
}

function fazerReserva(socioTitulo, churrasqueira, data, senha) {
    reservas.push({ title: socioTitulo, grill: churrasqueira, date: data, password: senha, reservaDataHora: new Date() });
    alert('Churrasqueira reservada com sucesso!');
}

function cancelarReserva() {
    const socioTitulo = document.getElementById('cancelTitle').value;
    const churrasqueira = document.getElementById('cancelGrill').value;
    const data = document.getElementById('cancelDate').value;
    const senha = document.getElementById('cancelPassword').value;

    const sucesso = desmarcarChurrasqueira(socioTitulo, churrasqueira, data, senha);

    if (sucesso) {
        alert('Reserva cancelada com sucesso.');
        limparFormularioCancelamento();
    } else {
        alert('Erro ao cancelar a reserva. Verifique as informações e tente novamente.');
    }
}

function desmarcarChurrasqueira(socioTitulo, churrasqueira, data, senha) {
    const reserva = reservas.find(reserva => reserva.title === socioTitulo && reserva.grill === churrasqueira && reserva.date === data);

    if (!reserva) {
        alert('Reserva não encontrada.');
        return false;
    }

    if (reserva.password !== senha) {
        alert('Senha incorreta.');
        return false;
    }

    const agora = new Date();
    const dataReserva = new Date(reserva.reservaDataHora);
    const horasRestantes = (agora - dataReserva) / (1000 * 60 * 60); // Diferença em horas

    if (horasRestantes > 24) {
        alert('Cancelamento após 24 horas não é permitido. Taxa de ausência de R$150,00 será cobrada.');
        return false;
    }

    const indexReserva = reservas.indexOf(reserva);
    reservas.splice(indexReserva, 1);
    return true;
}

function consultarReserva() {
    const socioTitulo = document.getElementById('consultTitle').value;
    const senha = document.getElementById('consultPassword').value;

    const reservasDoSocio = reservas.filter(reserva => reserva.title === socioTitulo && reserva.password === senha);

    if (reservasDoSocio.length > 0) {
        let mensagem = 'Suas reservas:\n';
        reservasDoSocio.forEach(reserva => {
            mensagem += `Churrasqueira ${reserva.grill} na data ${reserva.date}\n`;
        });
        alert(mensagem);
    } else {
        alert('Você ainda não possui reservas!');
    }
}

function limparFormulario() {
    document.getElementById('reservationForm').reset(); // Reseta todos os campos do formulário de reserva
}

function limparFormularioCancelamento() {
    document.getElementById('cancelForm').reset(); // Reseta todos os campos do formulário de cancelamento
}
//limparFormularioConsulta();

//function limparFormularioConsulta() {
  //  document.getElementById('consultForm').reset(); // Reseta todos os campos do formulário de consulta
