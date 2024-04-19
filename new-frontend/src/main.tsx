import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ChakraThemeColors } from './theme';
import App from './App.tsx'
import './index.css'

const ChakraTheme = extendTheme({
	colors: ChakraThemeColors,
	components: {
		Input: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'black'
				}
			},
			defaultProps: {
				focusBorderColor: 'yellow.600',
				colorScheme: 'yellow'
			}
		},
		Textarea: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'black'
				}
			},
			defaultProps: {
				focusBorderColor: 'yellow.600',
				colorScheme: 'yellow'
			}
		},
		NumberInput: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'black'
				}
			},
			defaultProps: {
				focusBorderColor: 'yellow.600',
				colorScheme: 'yellow'
			}
		},
		Button: {
			defaultProps: {
				colorScheme: 'yellow'
			}
		}
	}
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={ChakraTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
