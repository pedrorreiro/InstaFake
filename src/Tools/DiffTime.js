export const diffTime = (data) => {

    const dataAtual = new Date();
    const dataPostDate = new Date(data);
    const diffTime = Math.floor(dataAtual - dataPostDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffWeeks / 4.35);
    const diffYears = Math.floor(diffMonths / 12);

    var diff;

    if(diffYears > 0) {
        if(diffYears === 1) {
            diff = "há 1 ano";
        } else {
            diff = "há " + diffYears + " anos";
        }
    }

    else if(diffMonths > 0) {
        if(diffMonths === 1) {
            diff = "há 1 mês";
        } else {
            diff = "há " + diffMonths + " meses";
        }
    }

    else if(diffWeeks > 0) {
        if(diffWeeks === 1) {
            diff = "há 1 semana";
        } else {
            diff = "há " + diffWeeks + " semanas";
        }
    }

    else if(diffDays > 0) {
        if(diffDays === 1) {
            diff = "há 1 dia";
        } else {
            diff = "há " + diffDays + " dias";
        }
    }

    else if(diffHours > 0) {
        if(diffHours === 1) {
            diff = "há 1 hora";
        } else {
            diff = "há " + diffHours + " horas";
        }
    }

    else if(diffMinutes > 0) {
        if(diffMinutes === 1) {
            diff = "há 1 minuto";
        } else {
            diff = "há " + diffMinutes + " minutos";
        }
    }

    else diff= "há menos de 1 minuto";

    return diff;

}