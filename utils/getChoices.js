export default function getChoices(path, time) {
   return _.get(choices, path.join('.')).choices[time];
}
