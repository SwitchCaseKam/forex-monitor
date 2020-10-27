import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Club, clubs, groups } from './data.service.model';

enum apiUrlEndpoints {
  EXCHANGE = 'exchange',
  LIST_QUOTES = 'listquotes'
}


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://currency-exchange.p.rapidapi.com';
  private apiKey = 'b6522b5551msh1de7aa8e07c9d4ap1057cdjsn909b6627cea9';

  private apiUrlExchangeRates = 'https://api.exchangeratesapi.io/';

  constructor(private http: HttpClient) { }

  // public getCurrencyExchangeData(_q: string, _from: string, _to: string): Observable<string> {
  //   const _headers =  this.createRequestHttpHeader();
  //   return this.http.get<string>(`${this.apiUrl}/${apiUrlEndpoints.EXCHANGE}`, { headers: _headers,
  //     params: {
  //     q: _q,
  //     from: _from,
  //     to: _to
  //   } });

  // }

  // public getQuotesListData(): Observable<string[]> {
  //   const headers =  this.createRequestHttpHeader();
  //   return this.http.get<string[]>(`${this.apiUrl}/${apiUrlEndpoints.LIST_QUOTES}`, { headers });
  // }

  // private createRequestHttpHeader(): HttpHeaders {
  //   return new HttpHeaders({'x-rapidapi-key': this.apiKey, useQueryString: 'true'});
  // }



generateChampionsLeagueGroups(inputClubs: Map<string, Club[]> = clubs, outputGroups: Map<string, Club[]> = groups): void {
  for (let [potNumber, potClubs] of inputClubs.entries()) {
    // const clubsInPot = this.generateCandidates(potNumber, inputClubs, outputGroups);
    // for (const clubIndex of potClubs.length) {

    // }
    // let availableGroups = this.generateAvailableGroups(undefined, outputGroups)
    console.log('current pot = ', potNumber);
    potClubs.forEach( (club, index) => {
      const randomClubIndex = Math.floor(Math.random() * potClubs.length);
      const randomClub = potClubs[randomClubIndex];
      potClubs = potClubs.filter(item => item !== randomClub);
      console.log(randomClub)

      let availableGroups = this.generateAvailableGroups(randomClub, Number(potNumber), outputGroups);
      console.log('availableGroups: ', availableGroups);
      const randomGroupIndex = Math.floor(Math.random() * availableGroups.length);
      const randomGroup = availableGroups[randomGroupIndex];
      console.log(randomGroup);

      let currentStateOutputGroups = outputGroups.get(randomGroup);
      // console.log(outputGroups);
      currentStateOutputGroups.push(randomClub);
      outputGroups.set(randomGroup, currentStateOutputGroups);



    });


    console.log('* * * * *');

    // const clubsInPot = this.generateCandidates(potNumber, inputClubs, outputGroups);
    // let availableGroups = this.generateAvailableGroups(potNumber, inputClubs, outputGroups);

    // const randomClubIndex = Math.floor(Math.random() * clubsInPot.length);
    // const randomClub = clubsInPot[randomClubIndex];

    // const randomGroupIndex = Math.floor(Math.random() * availableGroups.length);
    // const randomGroup = availableGroups[randomGroupIndex];

    // console.log(randomClub);
    // console.log(randomGroup);
    // for (const club of potClubs) {
      // const randomIndex = Math.floor(Math.random() * availableGroups.length);
      // const randomElement = availableGroups[randomIndex];
      // delete availableGroups[randomIndex];

      // let clubsIngroup = outputGroups.get(randomElement);
      // const randomClubIndex = Math.floor(Math.random() * clubsIngroup.length);
      // const randomClub = availableGroups[randomClubIndex];
      // delete clubsIngroup[randomClubIndex];

      // console.log(availableGroups);
      // console.log(randomClub);
      // outputGroups.set(randomElement, )
    // }
  }
  console.log(outputGroups)

  for (const [currentGroup, groupClubs] of outputGroups.entries()) {
    console.log(currentGroup,': ');
    console.log(groupClubs[0].name, ' - ', groupClubs[1].name, ' - ', groupClubs[2].name, ' - ', groupClubs[3].name)
  }
}

generateCandidates(inputPot: string, inputClubs: Map<string, Club[]>, currentOutputClubs: Map<string, Club[]>): Club[] {
  const candidates = inputClubs.get(inputPot);
  return candidates;
}

generateAvailableGroups(currentClub: Club, potNumber: number, currentOutputClubs: Map<string, Club[]>): string[] {
  let availableGroups = Array.from(currentOutputClubs.keys());
  for (const [currentGroup, groupClubs] of currentOutputClubs.entries()) {
    if (groupClubs.length < potNumber) {
      for (const club of groupClubs) {
        if (club.country === currentClub.country) {
          availableGroups = availableGroups.filter(item => item !== currentGroup);
        }
        // availableGroups.add(currentGroup)
      }
    } else {
      availableGroups = availableGroups.filter(item => item !== currentGroup);
    }
  }
  return Array.from(availableGroups);
}

}
