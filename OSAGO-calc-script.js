$( function() {
	/* База данных коэффициентов */
	cffs = {
		"transport": {			// Вид автотранспорта:
				"la": 1980,			// Легковой автомобиль
				"ta": 2965,			// Такси (маршрутки и автобусы)
				"gal_16": 2025,		// Грузовые авто массой 16т. и менее
				"gab_16": 3240,		// Грузовые авто массой более 16т.
				"busl_20": 1620,	// Автобусы с числом мест до 20 включительно
				"busb_20": 2025,	// Автобусы с числом мест более 20
				"tsdsm": 1215,		// Тракторы самоходные, дорожно-строительные машины
				"moto": 1215,		// Мотоциклы и мотороллеры
				"prgr": 810,		// Прицепы к грузовым ТС
				"prtr": 305			// Прицепы к тракторам, самоходным, дорожно стоительным машинам
			},
		"power": {				// Мощность (л.с.):
			"l_50": 0.6,			// до 50
			"50_b_70": 1,			// свыше 50 до 70 включительно
			"70_b_100": 1.1,		// свыше 70 до 100 включительно
			"100_b_120": 1.2,		// свыше 100 до 120 включительно
			"120_b_150": 1.4,		// свыше 120 до 150 включительно
			"b_150": 1.6			// свыше 150
		},
		"territory": {			// Территория использования:
			"msc": 2,				// Москва
			"msco": 1.7				// Московская область
		},
		"term": {				// Срок страхования:
			"12_m": 1,				// 12 мес.
			"9_m": 0.95,			// 9 мес.
			"7_m": 0.8,				// 7 мес.
			"6_m": 0.7,				// 6 мес.
			"5_m": 0.65,			// 5 мес.
			"4_m": 0.6,				// 4 мес.
			"3_m": 0.5				// 3 мес.
		},
		"drivers": {			// Список водителей:
			"ogr": 1,				// Ограниченный
			"nogr": 1.8				// Неограниченный
		},
		"age_&_experience": {	// Возраст и стаж водителя транспортного средства:
			"l_22_l_3": 1.8,		// до 22 лет включительно со стажем вождения до 3 лет включительно
			"l_22_b_3": 1.6,		// более 22 лет со стажем вождения до 3 лет включительно
			"b_22_l_3": 1.7,		// до 22 лет включительно со стажем вождения свыше 3 лет
			"b_22_b_3": 1			// более 22 лет со стажем вождения свыше 3 лет
		},
		
		/* Дополнительные опции */
		
		"extension": {			// Добровольное расширение полиса ОСАГО:
			"none": 0,				// нет
			"l_500": 0,				// до 500 тыс. руб.
			"l_1_mln": 0,			// до 1 млн. руб.
			"l_1_5_mln": 0			// до 1,5 млн.руб.
		},
		"health": {				// Здоровье водителя и пассажиров:
			"none": 0,				// нет
			"100_t": 0,				// 100 тыс.руб.
			"300_t": 0				// 300 тыс.руб.
		},
		"card": {				// Диагностическая карта технического осмотра:
			"no": 0,				// нет
			"yes": 0				// да
		}
	};
	
	$("#OSAGO-calc").submit( function( event ) {
			
		// Базовый тариф
		var BT_arr = $("#OSAGO-calc #trans-tp option:selected").val();
		var BT = cffs["transport"][BT_arr];
		
		// Коэффициент мощности 
		var CP_arr = $("#OSAGO-calc #pwr option:selected").val();
		var CP = cffs["power"][CP_arr];
		
		// Коэффициент территории
		var CT_arr = $("#OSAGO-calc #terr option:selected").val();
		var CT = cffs["territory"][CT_arr];
		
		if ( BT == 305 || BT == 1215 ) {
			if ( CT == 2 ) {
				CT = 1.2;
			} else {
				CT = 1;
			}
		}
		
		// Коэффициент срока страхования
		var CTI_arr = $("#OSAGO-calc #term option:selected").val();
		var CTI = cffs["term"][CTI_arr];
		
		// Коффициент количества водителей
		var DN_arr = $("#OSAGO-calc input[name='drvr-list']:checked" ).val();
		var DN = cffs["drivers"][DN_arr];
		
		// Коэффициент стажа и возраста
		var CEA = cffs["age_&_experience"]["b_22_l_3"];  // по умолчанию больше 22 и стаж меньше 3
		
		var age = parseFloat( $("#OSAGO-calc input[name='drvr-age']:checked" ).val() );
		var exp = parseFloat( $("#OSAGO-calc input[name='drvr-exp']:checked" ).val() );
		
		
		if ( age*exp == 1 ) CEA = cffs["age_&_experience"]["b_22_b_3"];
		if ( age == 0 && exp == 0 ) CEA = cffs["age_&_experience"]["l_22_l_3"];
		if ( age == 0 && exp == 1 ) CEA = cffs["age_&_experience"]["l_22_b_3"];
		
		
		// Результат
		result = (BT * CP * CT * CTI * DN * CEA).toFixed(2);
		
		
		$("#OSAGO-calc").hide("slow");
		$("#OSAGO-calc-opt").show("slow");
	
		$("#OSAGO-calc-opt #OSAGO-res").empty().append( "Итог: <span style='color: orange'>" + result + "</span>" );
		
		event.preventDefault();
	});
	
	
	$("#OSAGO-calc-opt").submit( function( event ) {
		
		// Добровольное расширение полиса ОСАГО:
		var CE_arr = $("#OSAGO-calc-opt #ext option:selected").val();
		var CE = cffs["extension"][CE_arr];
		
		// Здоровье водителя и пассажиров:
		var CH_arr = $("#OSAGO-calc-opt #hlth option:selected").val();
		var CH = cffs["health"][CH_arr];
		
		// Диагностическая карта технического осмотра:
		var CC_arr = $("#OSAGO-calc-opt #card option:selected").val();
		var CC = cffs["card"][CC_arr];
		
		result_opt = (parseFloat(result) + CE + CH + CC).toFixed(2);
		
		$("#OSAGO-calc-opt #OSAGO-res")
		.empty()
		.hide()
		.append( "Итог: <span style='color: orange'>" + result_opt + "</span>" )
		.show("slow");
		
		event.preventDefault();
	});
	
	
	$("#OSAGO-calc-opt button").click( function( event ) {
		$("#OSAGO-calc-opt").hide("slow");
		$("#OSAGO-calc").show("slow");
		
		event.preventDefault();
	});
});