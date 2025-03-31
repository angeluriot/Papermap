export function int_to_text(number: number): string
{
	let result = number.toString();

	for (let i = result.length - 3; i > 0; i -= 3)
		result = result.slice(0, i) + ',' + result.slice(i);

	return result;
}


export function float_to_text(number: number): string
{
	if (number >= 1)
		return int_to_text(Math.round(number));

	const text = number.toString().split('.')[1];
	let nb_zeros = 0;

	for (let i = 0; i < text.length; i++)
		if (text[i] === '0')
			nb_zeros++;
		else
			break;

	return number.toFixed(nb_zeros + 1);
}
