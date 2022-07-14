# Quick-Loader
A quick and easy wrapper for retrieving information async while displaying a loader

## Quick
![alt text](https://scrumble.nl/wp-content/uploads/2020/03/quick.png "Quick image")
## Installation

```sh
npm install @scrumble-nl/react-quick-loader
```

or

```sh
yarn add @scrumble-nl/react-quick-loader
```
## Usage

This package makes a distinction by two types of usages.
1. Retrieving data from a url
2. Passing through data manually (useful if you want one api call and multiple loaders)

Both wil pass the data as a `data` prop to all of their children.
The actual implementations are as follows:

### Url variant
1. Import `QuickLoader` in the component where you want to create a loader
2. Implement the loader by giving it a `color`, `url` and at least one child component.
3. (optional) add `errorCallback` for handling the potential errors

```typescript
import React from 'react';

import QuickLoader from '@scrumble-nl/react-quick-loader'; // Step 1

export const App = (): JSX.Element => {
     return (
         <QuickLoader color="#ff9933" url='/api/user'> // Step 2
             <MyComponent />
         </Quickloader>     
     );
};
```

The following options can be used for customization:

| Name            |                                            Type                                            | Required | Description                                        | Default     |
|-----------------|:------------------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------|-------------|
| `color`         |                                           string                                           |  *true*  | The color for the loader                           |             |
| `url`           |                                           string                                           |  *true*  | The url used to retrieve data                      |             |
| `type`          | 'blank', 'balls', 'bars', 'bubbles', 'cubes', 'cylon', 'spin', 'spinningBubbles', 'spokes' | *false*  | The loader type                                    | `bars`      |
| `errorCallback` |                                    (error: any) => void                                    | *false*  | The custom callback for handling the error message | `undefined` |

### Data variant
The actual implementation is as follows:
1. Import `QuickLoader` in the component where you want to create a loader
2. Implement the loader by giving it a `color`, `data` and at least one child component
   1. As long as the `data` property is undefined it will show a loader

```typescript
import React, {useState, useEffect} from 'react';

import axios from 'axios';
import QuickLoader from '@scrumble-nl/react-quick-loader'; // Step 1

export const App = (): JSX.Element => {
   const [userOne, setUserOne] = useState<User>();
   const [userTow, setUserTwo] = useState<User>();

   useEffect(() => {
      axios.get('/api/user')
          .then(response => {
              setUserOne(response.data[0]);
              setUserTwo(response.data[1]);
          })
          .catch(error => {
              console.log(':(');
          });
   }, []);

   return (
       <>
            <QuickLoader color="#ff9933" data={userOne}> // Step 2 (step 3.1)
                <MyComponent /> 
            </Quickloader>
           <QuickLoader color="#ff9933" data={userTwo}> // Step 2 (step 3.1)
                <MyComponent />
           </Quickloader>
       </>
   );
};
```
The following options can be used for customization:

| Name         | Type                                                                                   | Required | Description                         | Default |
|--------------|:----------------------------------------------------------------------------------------:|:----------:|:-------------------------------------| -------- |
| `color`      | string                                                                                 | *true*     | The color for the loader           |  |
| `data`       | any                                                                                 | *true*    | The data passed to the children           | `undefined`|
| `type`       | 'blank', 'balls', 'bars', 'bubbles', 'cubes', 'cylon', 'spin', 'spinningBubbles', 'spokes'                                                                                 | *false*    | The loader type          | `bars` |

### Additional customization
Next to that you can override the classes `.spinner-container` and `.react-loading` to change the look of the loader.

## Roadmap
- [x] Packagize component
- [ ] Improve styling customizability
- [ ] Automated testing implementation
- [ ] Switch from interfaces to types
- [ ] Improve scss usage

## Contributing
If you would like to see additions/changes to this package you are always welcome to add some code or improve it.

## Scrumble
This product has been originally developed by [Scrumble](https://www.scrumble.nl) for internal use. As we have been using lots of open source packages we wanted to give back to the community. We hope this helps you getting forward as much as other people helped us!
