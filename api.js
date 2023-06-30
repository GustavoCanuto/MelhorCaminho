
var password = "";
while (password != "123") {
    password = window.prompt("Qual é a senha?")
}

function buscaCepLoja() {
    let cepInputLoja = document.getElementById('cepLoja');
    let cepLoja = cepInputLoja.value.replace(/\D/g, '');
    let validacep = /^[0-9]{8}$/;

    if (cepLoja != "" && validacep.test(cepLoja)) {
        $('#ruaLoja').val('...');
        $('#bairroLoja').val('...');
        $('#cidadeLoja').val('...');

        //busca e preenche as informações 
        $.getJSON(`https://viacep.com.br/ws/${cepLoja}/json/?callback=?`, function (data) {
            if (!('erro' in data)) {
                $('#ruaLoja').val(data.logradouro);
                $('#bairroLoja').val(data.bairro);
                $('#cidadeLoja').val(data.localidade);

                cepInputLoja.setCustomValidity('');
            } else {
                limpaForm();
                cepInputLoja.setCustomValidity('CEP não encontrado!');
            }
        });
    } else {
        limpaFormLoja();
        cepInputLoja.setCustomValidity('CEP inválido!');
    }
}

function limpaFormLoja() {
    $('#ruaLoja').val('');
    $('#bairroLoja').val('');
    $('#cidadeLoja').val('');
}

function buscaCepCliente() {
    let cepInputCliente = document.getElementById('cepCliente');
    let cepCliente = cepInputCliente.value.replace(/\D/g, '');
    let validacep = /^[0-9]{8}$/;

    if (cepCliente != "" && validacep.test(cepCliente)) {
        $('#ruaCliente').val('...');
        $('#bairroCliente').val('...');
        $('#cidadeCliente').val('...');

        //busca e preenche as informações 
        $.getJSON(`https://viacep.com.br/ws/${cepCliente}/json/?callback=?`, function (data) {
            if (!('erro' in data)) {
                $('#ruaCliente').val(data.logradouro);
                $('#bairroCliente').val(data.bairro);
                $('#cidadeCliente').val(data.localidade);

                cepInputCliente.setCustomValidity('');
            } else {
                limpaForm();
                cepInputCliente.setCustomValidity('CEP não encontrado!');
            }
        });
    } else {
        limpaFormCliente();
        cepInputCliente.setCustomValidity('CEP inválido!');
    }
}

function limpaFormCliente() {
    $('#ruaCliente').val('');
    $('#bairroCliente').val('');
    $('#cidadeCliente').val('');
}


function calcularDistancia() {
    let cepEndereco1 = document.getElementById("cepLoja").value;
    let ruaEndereco1 = document.getElementById("ruaLoja").value;
    let numeroEndereco1 = document.getElementById("numeroLoja").value;
    let bairroEndereco1 = document.getElementById("bairroLoja").value;
    let cidadeEndereco1 = document.getElementById("cidadeLoja").value;
    let cepEndereco2 = document.getElementById("cepCliente").value;
    let ruaEndereco2 = document.getElementById("ruaCliente").value;
    let numeroEndereco2 = document.getElementById("numeroCliente").value;
    let bairroEndereco2 = document.getElementById("bairroCliente").value;
    let cidadeEndereco2 = document.getElementById("cidadeCliente").value;
    const apiKey = "uytabsN3MzIxmDwT65aanufpiyjT3ZvO";
    let endereco1 = numeroEndereco1 + " " + ruaEndereco1 + " " + cidadeEndereco1 + " " + cepEndereco1;
    let endereco2 = numeroEndereco2 + " " + ruaEndereco2 + " " + cidadeEndereco2 + " " + cepEndereco2;
    var calPe = 15;
    var calBike = 10;
    var gasMoto = 0.025;
    var gasCarro = 0.1;
    var dados = [];
    var Locais = "";

    dados.push(
        document.getElementById("Nomeloja").value,
        document.getElementById("NomeCliente").value,
        document.getElementById("Obs").value
    );


    async function obterDistancia(enderecoOrigem, enderecoDestino) {

        let urlcarro = `https://www.mapquestapi.com/directions/v2/route?key=${apiKey}&from=${enderecoOrigem}&to=${enderecoDestino}&outFormat=json&routeType=car&unit=k`;//ok
        let urlpe = `https://www.mapquestapi.com/directions/v2/route?key=${apiKey}&from=${enderecoOrigem}&to=${enderecoDestino}&outFormat=json&routeType=pedestrian&unit=k`;//ok
        let urlbike = `https://www.mapquestapi.com/directions/v2/route?key=${apiKey}&from=${enderecoOrigem}&to=${enderecoDestino}&outFormat=json&routeType=bicycle&unit=k`;//ok

        try {

            let responsecarro = await fetch(urlcarro);//ok
            let datacarro = await responsecarro.json();//ok

            let distanciacarro = datacarro.route.distance;
            distNumCarro = parseFloat(distanciacarro);

            let responsepe = await fetch(urlpe);//ok 
            let datape = await responsepe.json();//ok

            let distanciape = datape.route.distance;
            distNumPe = parseFloat(distanciape);

            let responsebike = await fetch(urlbike);//ok
            let databike = await responsebike.json();//ok

            let distanciabike = databike.route.distance;
            distNumBike = parseFloat(distanciabike);

            let distanciaMetrospe = Math.round(distanciape * 1000);
            let distanciaMetrosbike = Math.round(distanciabike * 1000);


            // Verificar se a distância é menor que 1km e mostrar em metros
            if (distanciacarro < 1) {

                if (dados[0] != "" && dados[1] != "") {
                    Locais = `A distância entre ${dados[0]} e ${dados[1]} é:<br>`;
                }

                let resultado = document.getElementById("resultado");
                calBike = distNumBike * calBike;
                calPe = distNumPe * calPe;


                resultado.innerHTML = `${Locais}`;
                resultado.innerHTML += `Distância por bicicleta: ${distanciaMetrosbike} metros<br>`;
                resultado.innerHTML += `Distância a pé: ${distanciaMetrospe} metros<br>`;
                resultado.innerHTML += `Recomendamos ir a pé<br>`;
                resultado.innerHTML += `Você vai gastar ${calPe.toFixed(2)} calorias a pé<br>`;
                resultado.innerHTML += `Você vai gastar ${calBike.toFixed(2)} calorias de bicicleta<br>`;


            }
            else if (distanciacarro > 1 && distanciacarro < 5) {

                if (dados[0] != "" && dados[1] != "") {
                    Locais = `A distância entre ${dados[0]} e ${dados[1]} é:<br>`;
                }
                let resultado = document.getElementById("resultado");
                calBike = distNumBike * calBike;
                calPe = distNumPe * calPe;

                resultado.innerHTML = `${Locais}`;
                resultado.innerHTML += `Distância por bicicleta: ${distanciabike} Km<br>`;
                resultado.innerHTML += `Distância a pé: ${distanciape} Km<br>`;
                resultado.innerHTML += `Recomendamos ir de bicicleta<br>`;
                resultado.innerHTML += `Você vai gastar ${calBike.toFixed(2)} calorias de bicicleta<br>`;
                resultado.innerHTML += `Você vai gastar ${calPe.toFixed(2)} calorias a pé<br>`;




            }
            else if (distanciacarro <= 10) {
                if (dados[0] != "" && dados[1] != "") {
                    Locais = `A distância entre ${dados[0]} e ${dados[1]} é:<br>`;
                }
                let resultado = document.getElementById("resultado");
                gasMoto = distNumCarro * gasMoto;
                gasCarro = distNumCarro * gasCarro;

                resultado.innerHTML = `${Locais}`;
                resultado.innerHTML += `Distância por carro: ${distanciacarro} km<br>`;
                resultado.innerHTML += `Distância por moto: ${distanciacarro} km<br>`;
                resultado.innerHTML += `Recomendamos ir de moto<br>`;
                resultado.innerHTML += `Você vai gastar ${gasMoto.toFixed(2)} litros de gasolina de moto<br>`;
                resultado.innerHTML += `Você vai gastar ${gasCarro.toFixed(2)} litros de gasolina de carro<br>`;



            }
            else if (distanciacarro > 10) {
                if (dados[0] != "" && dados[1] != "") {
                    Locais = `A distância entre ${dados[0]} e ${dados[1]} é:<br>`;
                }
                let resultado = document.getElementById("resultado");
                gasCarro = distNumCarro * gasCarro;
                gasMoto = distNumCarro * gasMoto;

                resultado.innerHTML = `${Locais}`;
                resultado.innerHTML += `Distância por carro: ${distanciacarro} km<br>`;
                resultado.innerHTML += `Distância por moto: ${distanciacarro} km<br>`;
                resultado.innerHTML += `Recomendamos ir de carro<br>`;
                resultado.innerHTML += `Você vai gastar ${gasCarro.toFixed(2)} litros de gasolina de carro<br>`;
                resultado.innerHTML += `Você vai gastar ${gasMoto.toFixed(2)} litros de gasolina de moto<br>`;


            }
            else {
                resultado.innerHTML = `Erro`;
            }



        } catch (error) {
            console.log("Ocorreu um erro ao obter a distância:", error);
            alert("Ocorreu um erro ao obter a distância:", error);
        }

    }
    obterDistancia(endereco1, endereco2);


}