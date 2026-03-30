import { Request, Response } from 'express'
import { crashAnalysisService } from '../services/crashAnalysisService'
import { logger } from '../logger'

export class DiagnosticsController {
  /**
   * GET /diagnostics/report — Full crash analysis report
   * Includes exceptions, memory, timeouts, failing endpoints, system info
   */
  async report(_req: Request, res: Response) {
    try {
      const report = await crashAnalysisService.generateReport()
      res.json(report)
    } catch (error) {
      logger.error('DiagnosticsController.report failed', { message: error?.message })
      res.status(500).json({ error: 'Failed to generate crash report' })
    }
  }

  /**
   * GET /diagnostics/exceptions — Recent exceptions with top error grouping
   */
  exceptions(_req: Request, res: Response) {
    try {
      res.json({
        recent: crashAnalysisService.getRecentExceptions(50),
        topErrors: crashAnalysisService.getTopErrors(10),
      })
    } catch (error) {
      logger.error('DiagnosticsController.exceptions failed', { message: error?.message })
      res.status(500).json({ error: 'Failed to retrieve exceptions' })
    }
  }

  /**
   * GET /diagnostics/memory — Memory snapshots, spikes, and trend analysis
   */
  memory(_req: Request, res: Response) {
    try {
      res.json({
        current: crashAnalysisService.getCurrentMemory(),
        spikes: crashAnalysisService.getMemorySpikes(),
        trend: crashAnalysisService.getMemoryTrend(),
      })
    } catch (error) {
      logger.error('DiagnosticsController.memory failed', { message: error?.message })
      res.status(500).json({ error: 'Failed to retrieve memory data' })
    }
  }

  /**
   * GET /diagnostics/timeouts — Recent timeouts and hotspot routes
   */
  timeouts(_req: Request, res: Response) {
    try {
      res.json({
        recent: crashAnalysisService.getRecentTimeouts(50),
        hotspots: crashAnalysisService.getTimeoutHotspots(10),
      })
    } catch (error) {
      logger.error('DiagnosticsController.timeouts failed', { message: error?.message })
      res.status(500).json({ error: 'Failed to retrieve timeout data' })
    }
  }

  /**
   * GET /diagnostics/endpoints — Failing endpoints and high-load endpoints
   */
  endpoints(_req: Request, res: Response) {
    try {
      res.json({
        failing: crashAnalysisService.getFailingEndpoints(),
        highLoad: crashAnalysisService.getHighLoadEndpoints(10),
      })
    } catch (error) {
      logger.error('DiagnosticsController.endpoints failed', { message: error?.message })
      res.status(500).json({ error: 'Failed to retrieve endpoint data' })
    }
  }
}
