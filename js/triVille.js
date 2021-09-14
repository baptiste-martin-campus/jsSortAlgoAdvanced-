let csvFile;
let listVille = [];
let nbPermutation = 0;
let nbComparaison = 0;

// var axios = require('axios');
//
// var config = {
//   method: 'get',
//   url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=YOUR_API_KEY',
//   headers: { }
// };
//
// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

document.querySelector("#read-button").addEventListener('click', function() {
  csvFile = document.querySelector("#file-input").files[0];
  let reader = new FileReader();
  reader.addEventListener('load', function(e) {
    // récupération de la liste des villes
    listVille = getArrayCsv(e.target.result);

    // Calcul de la distance des villes par rapport à Grenoble
    listVille.forEach(ville => {
      ville.distanceFromGrenoble = distanceFromGrenoble(ville);
    });
    // Tri
    const algo = $("#algo-select").val();
    nbPermutation = 0;
    nbComparaison = 0;
    sort(algo);

    // Affichage
    displayListVille()
  });
  reader.readAsText(csvFile)
})

/**
 * Récupére la liste des villes contenu dans le fichier csv
 * @param csv fichier csv brut
 * @returns la liste des villes mis en forme
 */
function getArrayCsv(csv) {
  let listLine = csv.split("\n")
  listVille = [];
  let isFirstLine = true;
  listLine.forEach(line => {
    if (isFirstLine || line === '') {
      isFirstLine = false;
    } else {
      let listColumn = line.split(";");
      listVille.push(
        new Ville(
          listColumn[8],
          listColumn[9],
          listColumn[11],
          listColumn[12],
          listColumn[13],
          0
        )
      );
    }
  });
  return listVille;
}

/**
 * Calcul de la distance entre Grenoble et une ville donnée
 * @param ville ville
 * @returns la distance qui sépare la ville de Grenoble
 */


function distanceFromGrenoble(ville) {
  let lat2 = ville.latitude;
  let lon2 = ville.longitude;
  const lat1 = 45.188529;
  const lon1 = 5.724524;
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}

/**
 * Retourne vrai si la ville i est plus proche de Grenoble
 * par rapport à j
 * @param {*} i distance de la ville i
 * @param {*} j distance de la ville j
 * @return vrai si la ville i est plus proche
 */
function isLess(i, j) {
  return i.distanceFromGrenoble < j.distanceFromGrenoble;
}

/**
 * interverti la ville i avec la ville j dans la liste des villes
 * @param {*} i
 * @param {*} j
 */
function swap(i, j) {
  [listVille[i], listVille[j]] = [listVille[j], listVille[i]];
  nbPermutation++;
}

function sort(type) {
  switch (type) {
    case 'insert':
      insertsort(listVille);
      break;
    case 'select':
      selectionsort(listVille);
      break;
    case 'bubble':
      bubblesort(listVille);
      break;
    case 'shell':
      shellsort(listVille);
      break;
    case 'merge':
      listVille = mergesort(listVille);
      break;
    case 'heap':
      heapsort(listVille);
      break;
    case 'quick':
      quicksort(listVille);
      break;
  }
}

function insertsort() {
  let n = listVille.length
  for (let i = 1; i < n; i++) {
    let temp = listVille[i];
    let j = i;
    while (j > 0 && isLess(temp, listVille[j - 1])) {
      nbPermutation++
      listVille[j] = listVille[j - 1]
      j = j - 1;
    }
    listVille[j] = temp;
  }
}

function selectionsort() {
  let n = listVille.length;
  let min;
  for (let i = 0; i < n; i++) {
    min = i;
    for (let j = i + 1; j < n; j++) {
      if (isLess(listVille[j], listVille[min])) {
        nbPermutation++
        min = j;
      }
    }
    swap(i, min);
  }
}

function bubblesort() {
  let passage = 0;
  let permut = true;
  let n = listVille.length;
  while (permut == true) {
    permut = false;
    passage++;
    for (let i = 0; i < n - passage; i++) {
      if (isLess(listVille[i + 1], listVille[i])) {
        nbPermutation++
        swap(i, i + 1);
        permut = true;
      }
    }
  }
}

function shellsort() {
  let longueur = listVille.length;
  let n = 0;
  while (n < longueur) {
    n = 3 * n + 1;
  }
  while (n != 0) {
    n = Math.floor(n / 3);
    for (let i = n; i < longueur; i++) {
      let valeur = listVille[i];
      let j = i;
      while ((j > n - 1) && isLess(valeur, listVille[j - n])) {
        nbPermutation++
        listVille[j] = listVille[j - n];
        j = j - n;
      }
      listVille[j] = valeur;
    }
  }
}

function mergesort(listVille) {
  let n = listVille.length;
  let mid = Math.floor(n / 2);
  if (n <= 1) {
    return listVille
  } else {
    nbPermutation++
    let left = listVille.slice(0, mid);
    let right = listVille.slice(mid);
    return fusion(mergesort(left), mergesort(right));
  }
}

function fusion(left, right) {
  let result = [];
  if (left.length === 0) {
    return right;
  } else if (right.length === 0) {
    return left;
  } else if (isLess(left[0], right[0])) {
    result.push(left[0]);
    return result.concat(fusion(left.slice(1), right))
  } else {
    result.push(right[0]);
    return result.concat(fusion(left, right.slice(1)))
  }
}

function heapsort(listVille) {
  let longueur = listVille.length;
  organiser(listVille);
  for (let i = longueur - 1; i > 0; i--) {
    swap(0, i);
    redescendre(listVille, i, 0)
  }
}

function organiser(listVille) {
  let longueur = listVille.length;
  for (let i = 0; i < longueur - 1; i++) {
    remonter(listVille, i)
  }
}

function remonter(listVille, index) {
  if (isLess(listVille[Math.floor(index / 2)], listVille[index])) {
    swap(index, Math.floor(index / 2));
    remonter(listVille, Math.floor(index / 2));
  }
}

function redescendre(listVille, element, index) {
  let max;
  let formule = 2 * index + 1;
  if (formule < element) {
    if (isLess(listVille[2 * index], listVille[formule])) {
      max = formule;
    } else {
      max = 2 * index;
    }
    if (isLess(listVille[index], listVille[max])) {
      swap(max, index);
      redescendre(listVille, element, max);
    }
  }
}

function quicksort(listVille, first = 0, last = listVille.length - 1) {
    if (first < last) {
      pi = partitionner(listVille, first, last)
      quicksort(listVille, first, pi-1)
      quicksort(listVille, pi + 1, last)
    }
    return listVille;
  }

  function partitionner(listVille, first, last){
    let pivot = last;
    let j = first;
    for (let i = first; i < last; i++) {
      if (isLess(listVille[i], listVille[pivot])) {
        swap(i, j);
        j++;
      }
    }
    swap(last, j)
    return j;
  }

/** MODEL */

class Ville {
  constructor(nom_commune, codes_postaux, latitude, longitude, dist, distanceFromGrenoble) {
    this.nom_commune = nom_commune;
    this.codes_postaux = codes_postaux;
    this.latitude = latitude;
    this.longitude = longitude;
    this.dist = dist;
    this.distanceFromGrenoble = distanceFromGrenoble;
  }
}

/** AFFICHAGE */
function displayPermutation(nbPermutation) {
  document.getElementById('permutation').innerHTML = nbPermutation + ' permutations';
}

function displayListVille() {
  document.getElementById("navp").innerHTML = "";
  displayPermutation(nbPermutation);
  let mainList = document.getElementById("navp");
  for (var i = 0; i < listVille.length; i++) {
    let item = listVille[i];
    let elem = document.createElement("li");
    elem.innerHTML = item.nom_commune + " - \t" + Math.round(item.distanceFromGrenoble * 100) / 100 + ' m';
    mainList.appendChild(elem);
  }
}
